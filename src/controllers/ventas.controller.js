import { dbConfig } from "../config/db.config.js"
import { ValidationError } from "../errors/TypeError.js"
import { Producto } from "../models/Producto.model.js"
import { Usuario } from "../models/Usuario.model.js"
import { VentasProductos } from "../models/VentaProducto.model.js"
import { Venta } from "../models/Ventas.model.js"
import { isEmptyData, isValidDate, notFoundDaraRequestByPk } from "../utils/validations/validate.js"

//Vemos que en la carpetas asociaciones (en modelos), se tiene:
/*  1) Asosiación venta-producto
        La realación venta-productos es una relación muchos es a muchos, que necesita de una tabla intermedia
    2) Asosiación usuario-venta (pivote)
        La relación usuario-venta es una relación uno es a muchos, a diferencia, esta relación no necesita una tabla intermedia (pivote)
*/

//Estas intereacciones serán manejadas por un único controlador

/* Las transacciones tienen por lo menos tres partes
    i)      Begin
    ii)     Commit
    iii)    Rollback
*/

export const createVentaConProductos = async (req, res, next) => {
    // Se inicializa la transacción antes de declarar el try, en caso de que si, existe un error en la trasacción, este pueda ser capturado por el catch. De lo contrario, no permite hacer el rollback si algo sale mal

    const transaction = await dbConfig.transaction() // Método .transaction() es un método de sequelize, que al iniciar, da inicio al begin de la transacción.

    console.log("Ok con la config de la transacción");
    try {
        /* Detalles de la venta
            VARIABLE                        TIPO                                   RELACIÓN
            * id usuario                    (un solo dato; tipo STRING)            - uno a muchos
            * objeto                        Array<objetos> para productos          - muchos es a muchos
                id productos                (muchos datos; tipo array)                      
                precio de c/ producto       (muchos datos; tipo array)
                cantidad de C producto      (muchos datos; tipo array)
            
            * fecha (posee condición)       Tipo DATE, si no está, es un NOW()        

        * total                             Calculable (desde productos)    
        */

        //1) se guardan los datos de la requesst
        const { usuarioId, productos, fechaVenta } = req.body
        //2) valida que la request no llega vacía
        isEmptyData(usuarioId, 'Id del usuario');
        isEmptyData(productos, 'Productos');

        //no importa le fecha por que de no venir, se lanza el now(), por lo tanto no será vacío.

        //3) se asegura el dato exista en el modelo
        await notFoundDaraRequestByPk(Usuario, usuarioId, true, transaction);

        //4) Se confirman los productos, sub totales, y totales
        let total = 0
        for (const producto of productos) {

            if (!producto.productoId || !producto.cantidad || producto.cantidad < 0) throw new ValidationError(`Los productos deben contener los campos "productosID" y cantidad mayor a cero`);

            const productoData = await notFoundDaraRequestByPk(Producto, producto.productoId, true, transaction);

            //manejo de stock
            productoData.stock = productoData.stock - producto.cantidad
            productoData.save()

            const subtotal = productoData.price * producto.cantidad;
            total += subtotal
        }

        //5) Verificar se mandó una fecha, de lo contrario enviar la actual (now())
        const fecha = isValidDate(fechaVenta)

        //6) crear objeto de venta
        const ventaData = {
            usuarioId,
            fecha,
            total
        }

        const venta = await Venta.create(ventaData,
            { transaction: transaction }
        )

        console.log("salgo del paso 6");

        //7) Insertar detalles de la venta en VENTA-PRODUCTO (que es una relación muchos a muchos, por lo que tenemos que vincularlos)

        for (const producto of productos) {
            const productoData = await notFoundDaraRequestByPk(Producto, producto.productoId, true, transaction);

            console.log("product data", productoData);
            console.log("producto", producto);
            //productoData.Price viene desde la transacción (por lo tanto)
            //product.cantidad por otro lado, viene desde la request
            const subtotal = productoData.price * producto.cantidad;

            console.log("subtotal", subtotal);
            //8) Objeto con la data de Venta-Producto para guardar la referencia en la DB

            const ventaProductoData = {
                // debe tener los mismos elementos del modelo ventaProducto para que exista correspondencia 
                ventaId: venta.id,
                productoId: productoData.id,
                cantidad: producto.cantidad,
                subtotal: subtotal // puedo omitir ya que valor y campo comparten nombre
            };

            await VentasProductos.create(ventaProductoData, { transaction: transaction })
        }

        console.log("salgo paso 7");
        // Ahora en el catch se ejecuta el commit con el método de sequelize, sobre la variable transaction definida fuera.
        await transaction.commit();

        res.status(201).json({
            message: "Venta craeda exitosamente",
            status: 201,
            data: venta
        })

    } catch (error) {
        //método rollback de sequelize
        await transaction.rollback();
        next(error)
    }

}

//este controlador traerá información detallada de la venta,que no se encuentra en la tabla venta-producto, si no dispersa entre varios modelos
export const getAllSalesWithDetails = async (req, res, next) => {
    try {
        const sales = await Venta.findAll({
            //include es lo que hace los JOIN 
            include: //siempre es una arreglo, que contiene la estructuras que estoy buscando
                [
                    //se define un objeto nuevo, que le dice a Sequelize a qué modelo se está aludiendo
                    {
                        model: Usuario,
                        as: "usuario",
                        attributes: ['id', 'nombre', 'apellido_paterno', 'email']
                    },
                    {
                        model: Producto,
                        as: "productos",
                        //Es posible pedir detalles de la tabla intermedia que estén relacionados al modelo mediante el atributo "through". No es necesario indicar la tabla intermedia  puesto que la relación ya ha sido definida en las asociaciones del modelo (solo con relación muchos es a muchos, si no, no la encontrará).
                        through: {
                            attributes: ['cantidad', 'subtotal']
                        },
                        attributes: ['id', 'nombre', 'price']
                    }
                ],
            order: [['createdAt', 'DESC']]
        })

        res.status(200).json({
            message: 'Ventas obtenidas con éxito',
            status: 200,
            data: sales
        })

    } catch (error) {
        next(error)
    }
}


export const getSalesByUserId = async (req, res, next) => {

    try {
        console.log(req.params)
        const { usuarioId } = req.params;
        const sales = await Venta.findAll({
            where: { usuarioId },
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'email', 'telefono']
                },
                {
                    model: Producto,
                    as: 'productos',
                    through: {
                        attributes: ['cantidad', 'subtotal']
                    },
                    attributes: ['id', 'nombre', 'price']
                }
            ],
            attribute: { exclude: ['usuarioId',] },
            limit: 10,
        })

        res.status(200).json({
            message: 'Ventas obtenidas con éxito',
            status: 200,
            data: sales
        })
    } catch (error) {
        next(error)
    }
}
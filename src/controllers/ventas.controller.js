import { dbConfig } from "../config/db.config.js"
import { ValidationError } from "../errors/TypeError.js"
import { Producto } from "../models/Producto.model.js"
import { Usuario } from "../models/Usuario.model.js"
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
        const { usuarioId, productos, fecha } = req.body

        //2) valida que la request no llega vacía
        isEmptyData(usuarioId, 'Id del usuario');
        isEmptyData(productos, 'Products');
        //no importa le fecha por que de no venir, se lanza el now(), por lo tanto no será vacío.

        //3) se asegura el dato exista en el modelo
        await notFoundDaraRequestByPk(Usuario, usuarioId, true, transaction);

        //4) Se confirman los productos, sub totales, y totales
        let total = 0
        for (const producto of productos) {
            if (!producto.id || !producto.stock < 0) throw new ValidationError(`Los productos deben contener los campos "productosID" y cantidad mayor a cero`);

            await notFoundDaraRequestByPk(Producto, producto.productoId, true, transaction);

            const subtotal = producto.price * producto.stock;
            total += subtotal
        }

        //5) Verificar se mandó una fecha, de lo contrario enviar la actual (now())
        fecha = isValidDate(fecha);

        //&) crear objeto de venta
        const ventaData = {
            usuarioId,
            fecha,
            total
        }

        const venta = await Venta.cerate(ventaData,
            { transaction: transaction }
        )

        // Ahora en el catch se ejecuta el commit con el método de sequelize, sobre la variable transaction definida fuera.
        await transaction.commit();

    } catch (error) {
        //método rollback de sequelize
        await transaction.rollback();
        next(error)
    }

}
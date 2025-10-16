import { Producto } from "../Producto.model.js"
import { VentaProductos } from "../VentaProducto.model.js"
import { Venta } from "../Ventas.model.js"


//caso muchos es a muchos
export const setupVentaProducto = () => {

    console.log("entra a la función que inicializa la relación venta - producto");

    Venta.belongsToMany(Producto, {
        through: VentaProductos,
        foreignKey: 'ventaId',
        otherKey: 'productoId',
        as: 'productos'
    })

    Producto.belongsToMany(Venta, {
        through: VentaProductos,
        foreignKey: 'productoId',
        otherKey: 'ventaId',
        as: 'ventas'
    })

}
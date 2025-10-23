import { Producto } from "../Producto.model.js"
import { VentasProductos } from "../VentaProducto.model.js"
import { Venta } from "../Ventas.model.js"


//caso muchos es a muchos
export const setupVentaProducto = () => {

    Venta.belongsToMany(Producto, {
        through: VentasProductos,
        foreignKey: 'ventaId',
        otherKey: 'productoId',
        as: 'productos'
    })

    Producto.belongsToMany(Venta, {
        through: VentasProductos,
        foreignKey: 'productoId',
        otherKey: 'ventaId',
        as: 'ventas'
    })

}



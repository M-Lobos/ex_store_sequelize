

import { dbConfig } from "../../config/db.config.js";
import { DataBaseError } from "../../errors/TypeError.js";
import { initProducto } from "../../models/Producto.model.js";
import { initUsuario } from "../../models/Usuario.model.js"
import { initVentaProducto } from "../../models/VentaProducto.model.js";
import { initVenta } from "../../models/Ventas.model.js";

export const initModels = (config) => {
    try {
        initUsuario(config);
        initProducto(config);
        initVenta(config);
        initVentaProducto(dbConfig);
    } catch (error) {
        console.error(error)
        throw new DataBaseError('Error al inicializar los modelos.')
    }
}
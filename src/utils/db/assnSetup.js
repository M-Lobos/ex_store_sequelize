import { DataBaseError } from "../../errors/TypeError.js";
import { setupUsuarioVenta } from "../../models/asociations/usuario_venta.assn.js"

export const setupAssn = () => {
    try {
        setupUsuarioVenta();
    } catch (error) {
        console.error('Error al inicializar las relaciones', error)
        throw new DataBaseError('La relación no pudo inicializarse', error)
    }
}
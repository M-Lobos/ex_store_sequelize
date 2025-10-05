import { Op } from "sequelize"
import { ValidationError } from "../../errors/TypeError.js";

/**
 * Valida que los registros que se evaluan no exístan PREVIAMENTE para valores que sean únicos, para evitar valores duplicados
 * @param {Model} Modelo        - Modelo constructor de los datos que se comunica con la DB
 * @param {object} data         - Datos a evaluar en la petición hacia la DB
 * @param {string} field        - Campo que se desea evaluar en la clausula where
 * @param {string} excluidID    - ID en formato UUID que será excluída de esta validación. Por defecto Null
 * @throws {ValidationError}    - Si el valor exista arrojará error de validación 
 */

export const validateExistData = async (Modelo, data, field, excluidID = null) => {
    if (data[field]) {
        const whereClause = { [field]: data[field] }

        /* SE VERIFICA SI SE DEBE EXCLUIR EL RESGISTRO QUE SE ESTÁ EVALUANDO (PARA LOS UPDATE) */
        if (excluidID) {
            whereClause.id = { [Op.ne]: excluidID } // Op.ne => Operador Not Equal (de sequelize) 
        }

        const existData = await Modelo.findOne({ where: whereClause });
        if (existData) {
            throw new ValidationError(`El campo "${field}" ya está en uso por otro registro en "${Modelo}"`)
        }
    }
}

export const isEmptyResponseData = (data) => {
    if(!data || data.length === 0) {
        throw new ValidationError('La data solicitada no pudo ser encontrada')
    }
}
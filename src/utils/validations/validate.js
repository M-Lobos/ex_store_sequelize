import { Op } from "sequelize"
import { NotFoundError, ValidationError } from "../../errors/TypeError.js";

export const ValidateIsArray = (data) => {
    if (!Array.isArray(data))
        throw new ValidationError(
            'La data ingresada debe ser un arreglo'
        );
}

export const isEmptyData = (data) => {
    if (!data || data.length === 0) {
        throw new ValidationError("La data ingresada está vacía")
    }
}

export const isEmptyResponseData = (data) => {
    if (!data || data.length === 0) {
        throw new NotFoundError('La data solicitada no pudo ser encontrada')
    }
}

/**
 * Valida que los registros que se evaluan no exístan PREVIAMENTE para valores que sean únicos, para evitar valores duplicados
 * @param {Model} Modelo        - Modelo constructor de los datos que se comunica con la DB
 * @param {object} data         - Datos a evaluar en la petición hacia la DB
 * @param {Array<string>} field        - Campo que se desea evaluar en la clausula where
 * @param {string} excluidID    - ID en formato UUID que será excluída de esta validación. Por defecto Null
 * @throws {ValidationError}    - Si el valor exista arrojará error de validación 
 */

export const validateExistData = async (Modelo, data, fields, excluidID = null) => {

    const duplicatedFields = [];

    ValidateIsArray(fields); //Se asegura que sea un arreglo

    for (const field of fields) {

        if (data[field]) {
            const whereClause = { [field]: data[field] }

            /* SE VERIFICA SI SE DEBE EXCLUIR EL RESGISTRO QUE SE ESTÁ EVALUANDO (PARA LOS UPDATE) */
            if (excluidID) {
                whereClause.id = { [Op.ne]: excluidID } // Op.ne => Operador Not Equal (de sequelize) 
            }

            const existData = await Modelo.findOne({ where: whereClause });
            if (existData) {
                duplicatedFields.push(field)
            }
        }
    }

    if (duplicatedFields.length > 0) {
        const fieldString = duplicatedFields.map(field => `"${field}"`).join(', ')
        throw new ValidationError(`Los campos ${fieldString} ya están en uso en "${Modelo.name}"`)
    }

}


import { Model, Op } from "sequelize"
import { NotFoundError, ValidationError } from "../../errors/TypeError.js";

export const ValidateIsArray = (data) => {
    if (!Array.isArray(data))
        throw new ValidationError(
            'La data ingresada debe ser un arreglo'
        );
}

export const isEmptyData = (data, field) => {
    if (!data || data.length === 0) {
        throw new ValidationError(`La data en ${field} no puede estar vacía`)
    }
}

export const isEmptyResponseData = (data) => {
    if (!data || data.length === 0) {
        throw new NotFoundError('La data solicitada no pudo ser encontrada')
    }
}

export const isAlreadyDeleted = (data) => {
    if (data.deletedAt !== null) {
        console.log(data.deletedAt);
        const error = new Error(`El usuario con ID ${id} ya está inactivo/eliminado.`);
        error.status = 409; // 409 Conflict
        throw error;
    }
}

export const isValidDate = (fecha) => {

    if (!fecha) return new Date();
    const parseDate = new Date(fecha);

    if (isNaN(parseDate.getTime())) {
        throw new ValidationError(
            "La fecha debe tener el formato adecuado de YYYY-MM-DD"
        );
    }
    return parseDate
}




/**
 * Valida que los registros que se evaluan no exístan PREVIAMENTE para valores que sean únicos, para evitar valores duplicados
 * @param {Model} Model        - Modelo constructor de los datos que se comunica con la DB
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

/**
 * Valida que exista un registro dentro deun modelo basado en su pk 
 * @param {Model} Model                             - La tabla que se desea implementar en la función
 * @param {String} pk                               - Primary Key para ejecutar búsqueda en la tabla del modelo
 * @param {Boolean} transaction                     - Indica si la función es o no llamada dentro de una tarnsacción
 * @param {Promise<object>} transactionConfig       - Variable que contiene el Beggin de la transacción de sequelize
 * @throws {NotFoundError}                          - Error si se no encuentra la data dentro del modelo mediante la PK
 * @returns {Promise<object>}                       - Retorna la data del modelo consultado mediante su Pk 
 */

export const notFoundDaraRequestByPk = async (Model, pk, transaction = false, transactionConfig) => {
    // los argumentos transaction y transactionConfig {variable que contiene la configuración de sequelize definida como "const transaction = await dbConfig.transaction()" en el controlador"} permiten que la función se abstracta y aplicable a varios controladores, respetando los criterios ACID 

    //  así si el controlador no actúa sobre una transacción los argumentos sólo son el Modelo y su Pk
    let data = null

    if (transaction) {
        data = await Model.findByPk(pk, { transaction: transactionConfig })

        /* el Objeto de configuraciones posee un campo transaction:
            {transaction: transactionConfig} (para esta función)

            Esta recibe la configuración de la transacción, en este caso el BEGIN de la misma (definido como const transaction = await dbConfig.transaction()" en el controlador) asegurándose de cumplir los criterios ACID 
        */

    } else {
        data = await Model.findByPk(pk)
    }

    if (!data) throw NotFoundError(`Datos con pk ${pk}en la tabla ${Model.tableName} no encontrados`);

    return data
}
import { Op } from 'sequelize';

// Utilidad opcional: convierte filtros anidados en una estructura { campo: { [OpX]: valor } }
export const buildConditionForField = (field, filterValue) => {
    // Si el filtro llega como objeto con operador
    if (typeof filterValue === 'object' && filterValue !== null) {
        const [operatorKey] = Object.keys(filterValue);
        const value = filterValue[operatorKey];
        // Mapea a operador Sequelize
        const opMap = {
            gt: Op.gt,
            gte: Op.gte,
            lt: Op.lt,
            lte: Op.lte,
            ne: Op.ne,
            eq: Op.eq,
            like: Op.like,
            iLike: Op.iLike,
            notLike: Op.notLike,
            in: Op.in,
            notIn: Op.notIn,
        };
        const sequelizeOp = opMap[operatorKey];
        if (sequelizeOp) {
            return { [field]: { [sequelizeOp]: value } };
        }
        // Si operador no reconocido, retornar null para manejar en caller
        return null;
    }
    // Filtro de igualdad simple
    return { [field]: filterValue };
}

// Construye arreglo de condiciones para AND
export const buildAndConditions = (filters) => {
    const keys = Object.keys(filters);
    const conditions = [];

    for (const key of keys) {
        const cond = buildConditionForField(key, filters[key]);
        if (cond) {
            conditions.push(cond);
        }
    }

    if (conditions.length === 0) return null;
    // Si sólo hay una condición, no necesitar Op.and
    return conditions.length === 1 ? conditions[0] : { [Op.and]: conditions };
}

// Construye cláusula OR a partir de los filtros ya normalizados
export const buildOrConditions = (filters) => {
    const keys = Object.keys(filters);
    const orArray = [];

    for (const key of keys) {
        const cond = buildConditionForField(key, filters[key]);
        if (cond) {
            orArray.push(cond);
        }
    }

    if (orArray.length === 0) return null;
    return { [Op.or]: orArray };
}


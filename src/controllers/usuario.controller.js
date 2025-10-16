import { Op } from "sequelize";
import { Usuario } from "../models/Usuario.model.js"
import { validateExistData, isEmptyResponseData } from "../utils/validations/validate.js"
import { NotFoundError, ValidationError } from "../errors/TypeError.js";


export const createUser = async (req, res, next) => {

    await validateExistData(Usuario, req.body, ['email', 'telefono'])

    try {
        const user = await Usuario.create(req.body);

        res.status(201).json({
            message: 'Usuario creado con éxito',
            status: 201,
            data: user
        })

    } catch (error) {
        next(error)
    }
}

export const getAllActiveUsers = async (req, res, next) => {
    try {
        const users = await Usuario.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            }
        });

        isEmptyResponseData(users);

        res.status(200).json({
            message: 'Usuarios encontrados con éxito',
            status: 200,
            data: users,
        })


    } catch (error) {
        next(error)
    }
}

export const getActiveUsersById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await Usuario.findOne({
            where: { id },
            attributes: {
                exclude: [
                    'createdAt', 'updatedAt', 'deletedAt'
                ]
            }
        });

        isEmptyResponseData(user);

        res.status(200).json({
            message: 'Usuario encontrado exitosamente',
            status: 200,
            data: user
        })

    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const updateData = req.body;

        await validateExistData(
            Usuario,
            updateData,
            ["email"],  //mandamos al menos uno como arreglo que el método de validación así lo pide
            id
        );

        const [updateRows, [updateUser]] = await Usuario.update(updateData, {
            where: { id },
            returning: true,
            attributes: {
                exclude: [
                    'createdAt', 'updatedAt',/*  'deletedAt' */
                ]
            }
        });

        if (updateRows === 0) {
            throw new NotFoundError(`No se encontró el usuario con el ID:${id}`)
        }

        res.status(200).json({
            message: 'Usuario actualizado con éxito',
            status: 200,
            data: updateUser
        });

    } catch (error) {
        next(error)
    }
}

export const userSoftDelete = async (req, res, next) => {
    // es importarte destacar que todos los delete de base que trae sequelize son soft-delete, lo que nos ahorra trabajar con active
    try {

        const { id } = req.params;
        const user = await Usuario.findByPk(id, { paranoid: false });

        isEmptyResponseData(user);

        if (user.deletedAt !== null) {
            console.log(user.deletedAt);
            const error = new Error(`El usuario con ID ${id} ya está inactivo/eliminado.`);
            error.status = 409; // 409 Conflict
            throw error;
        }

        await user.destroy();

        res.status(200).json({
            message: 'Usuario Eliminado con éxito',
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}

export const getUserByFilters = async (req, res, next) => {
    try {
        // 1. Desestructura para separar 'logic' del resto
        const { logic, ...restFilters } = req.query; // aquí se devuelve un objeto que trae los filtros y la lógica

        let whereClause = {}; // Si no hay filtros, whereClause será {}, lo que devuelve todos los usuarios.

        // 2. Obtener los filtros, excluyendo 'logic'
        const actualFilters = restFilters; // { key_filtro_1: 'value_filtro_1', key_filtro_2: 'value_filtro_2' }
        const filterKeys = Object.keys(actualFilters);

        //Por defecto la lógica opera como AND, pero sino en la url debe especificiarse url/?logic=or&filter1&filter2...etc
        // 3. Lógica Condicional para AND o OR
        if (logic === 'or' && filterKeys.length > 0) {
            // Caso OR: Construir un array de condiciones para Op.or
            const conditionOr = [];
            for (const key of filterKeys) {
                conditionOr.push({ [key]: actualFilters[key] });
                console.log("arreglo conditionOr", key, conditionOr);
            }

            // Aplicar el operador OR
            whereClause = {
                [Op.or]: conditionOr
            };
        } else if (filterKeys.length > 0) {
            whereClause = actualFilters;
        }

        // 4. Ejecutar la consulta con la cláusula dinámica, whereClauses puede ser objeto AND o OR
        const users = await Usuario.findAll({
            where: whereClause,
            attributes: {
                exclude: [
                    'createdAt', 'updatedAt', 'deletedAt'
                ]
            }
        });

        isEmptyResponseData(users);

        res.status(200).json({
            message: "Usuarios encontrados con éxito",
            status: 200,
            data: users
        });

    } catch (error) {
        next(error)
    }
}

/* ADMIN CONTROLLERS */

export const getAllUsersIncludedDeleted = async (req, res, next) => {
    try {
        const users = await Usuario.findAll({ paranoid: false })

        isEmptyResponseData(users)

        res.status(200).json({
            message: 'Usuarios encontrados con éxito',
            status: 200,
            data: users
        })

    } catch (error) {
        next(error)
    }
}

export const getDeletedUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await Usuario.findByPk(id, { paranoid: false });

        isEmptyResponseData(user);

        res.status(200).json({
            message: 'Usuario encontrado con éxito',
            status: 200,
            data: user,
        })
    } catch (error) {
        next(error)
    }
}

export const restoreUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await Usuario.findByPk(id, { paranoid: false });

        isEmptyResponseData(user);

        if (user.deletedAt = null) throw new ValidationError(`El usuario ${id} no ha sido eliminado`);
        //metodo restore de sequelize
        await user.restore();

        res.status(200).json({
            message: 'Usuario restaurado con éxito',
            status: 200,
            data: user,
        })
    } catch (error) {
        next(error)
    }
}

export const physicDelete = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await Usuario.findByPk(id);

        if (!user) {
            throw new NotFoundError('No es posible encontrar el usuario que desea eliminar');
        }

        await user.destroy({ force: true });

        res.status(200).json({
            message: 'Usuario eliminado con éxito',
            status: 200
        })
    } catch (error) {
        next(error)
    }
}
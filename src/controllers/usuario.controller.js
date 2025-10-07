import { Op } from "sequelize";
import { Usuario } from "../models/Usuario.model.js"
import { validateExistData, isEmptyResponseData } from "../utils/validations/validate.js"
import { NotFoundError } from "../errors/TypeError.js";

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
            ["email"],
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

export const userSoftDelete = async (req, res) => {
    try {
        const { id } = req.params
        const user = await Usuario.findByPk(id)

        isEmptyResponseData(user)

        await user.destroy();

        res.status(200).json({
            message: 'Usuario Eliminado con éxito',
            status: 200,
        })


    } catch (error) {
        next(error)
    }
}

/* export const getUserByFilters = async (req, res, next) => {

    try {
        const filters = req.query // aquí se devuelve un objeto que trae los filtros
        const whereClause = {}

        console.log("filters", filters)

        for (const key in filters) {
            if (Object.hasOwn(filters, `${key}`)) {
                whereClause[key] = filters[key]
            }
        }

        console.log("clausula", whereClause);

        const users = await Usuario.findAll({
            where: { ...whereClause, },  // para sequelize, esto es un AND por defecto  
            attributes: {
                exclude: [
                    'createdAt', 'updatedAt', 'deletedAt'
                ]
            }
        })

        isEmptyResponseData(users);

        res.status(200).json({
            message: "Usuarios encontrados con éxito",
            status: 200,
            data: users
        })

    } catch (error) {
        next(error)
    }
} */

export const getUserByFilters = async (req, res, next) => {
    try {
        // 1. Desestructura para separar 'logic' del resto
        const { logic, ...restFilters } = req.query; 
        
        let whereClause = {};
        
        // 2. Obtener los filtros REALES, excluyendo 'logic'
        const actualFilters = restFilters; // { apellido_paterno: 'Lobos', apellido_materno: 'Olivares' }
        const filterKeys = Object.keys(actualFilters);

        // 3. Lógica Condicional para AND o OR
        
        if (logic === 'or' && filterKeys.length > 0) {
            // Caso OR: Construir un array de condiciones para Op.or
            const condicionesOR = [];
            
            for (const key of filterKeys) {
                // Agregar cada filtro como un objeto de condición OR
                // e.g., { apellido_paterno: 'Lobos' }
                condicionesOR.push({ [key]: actualFilters[key] });
            }

            // Aplicar el operador OR
            whereClause = {
                [Op.or]: condicionesOR
            };

            console.log("clausula OR:", whereClause);
            
        } else if (filterKeys.length > 0) {
            // Caso AND (default o logic=and, o cualquier otro valor):
            // Simplemente usar el objeto de filtros directamente.
            // Sequelize lo interpreta como AND por defecto.
            whereClause = actualFilters;
            
            console.log("clausula AND:", whereClause);
        }

        // Si no hay filtros, whereClause será {}, lo que devuelve todos los usuarios.
        
        // 4. Ejecutar la consulta con la cláusula dinámica
        const users = await Usuario.findAll({
            where: whereClause, // Ahora whereClause puede ser un objeto AND o un objeto OR
            attributes: {
                exclude: [
                    'createdAt', 'updatedAt', 'deletedAt'
                ]
            }
        });

        // Tu utilidad de manejo de respuesta vacía
        // isEmptyResponseData(users);

        res.status(200).json({
            message: "Usuarios encontrados con éxito",
            status: 200,
            data: users
        });

    } catch (error) {
        // next(error);
        console.error(error); // Mejorar el manejo de errores
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}
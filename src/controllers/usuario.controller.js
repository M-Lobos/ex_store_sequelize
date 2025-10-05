import { Association } from "sequelize";
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

    }
}


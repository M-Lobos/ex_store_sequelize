import { Usuario } from "../models/Usuario.model.js"
import { validateExistData } from "../utils/validations/validate.js"

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




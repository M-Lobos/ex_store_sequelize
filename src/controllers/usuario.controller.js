import { Usuario } from "../models/Usuario.model.js"

export const createUser = async (req, res) => {

    try {
        const data = req.body
        const user = await Usuario.create(data);

        res.status(201).json({
            message: 'Usuario creado con éxito',
            status: 201,
            data: user
        })

    } catch (error) {
        console.error()
    }
}




import { Usuario } from "../models/Usuario.model.js"


export const createUser = async (req, res) => {
    console.log("llego al controlador");
    try {

        console.log("Entron al try del controlador");

        const data = req.body

        console.log(`tipo de dato
            ${typeof data}`);

        const user = await Usuario.create(data);

        console.log("user");

        res.json({
            message: 'Usuario creado con éxito',
            status: 201,
            data: user
        })

    } catch (error) {
        console.error()
    }
}




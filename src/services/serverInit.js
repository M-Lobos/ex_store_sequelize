import { dbConnection } from "./dbConnection.js"

export const serverInit = async (app, port) => {
    try {
        console.log('Conectando con la DB');
        await dbConnection()

        app.listen(port, () => {
            console.log(`Servidor corriendo en puerto ${port} 📡`);
        });
    } catch (error) {
        console.error("error al levantar el servidor", error)
    }
}
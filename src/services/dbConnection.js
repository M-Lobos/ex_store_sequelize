import { dbConfig } from "../config/db.config.js";
import { initUsuario } from "../models/Usuario.model.js";

let DB = process.env.DB_NAME

export const dbConnection = async () => {
    try {
        await dbConfig.authenticate();
        initUsuario(dbConfig);
        await dbConfig.sync();

        console.log(`Se ha establecido conexión con la DB: ${DB}`);
    } catch (error) {
        console.error("no pudimos conectarnos con la DB ", error)
        process.exit(1)
    }
}
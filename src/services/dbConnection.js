import { dbConfig } from "../config/db.config.js";
import { setupAssn } from "../utils/db/assnSetup.js";
import { initModels } from "../utils/db/initModels.js";

let DB = process.env.DB_NAME

export const dbConnection = async () => {
    try {
        await dbConfig.authenticate();
        initModels(dbConfig);
        setupAssn()
        await dbConfig.sync({ alter: true }); //alter: true permite migrar la tabla ya sincronizada, para alterar las tablas

        console.log(`Se ha establecido conexión con la DB: ${DB}`);
    } catch (error) {
        console.error("no pudimos conectarnos con la DB ", error)

    }
}
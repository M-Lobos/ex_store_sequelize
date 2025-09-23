import { dbConfig } from "../config/db.config.js"

let DB = process.env.DB_NAME

export const dbConnection = async () => {
    try {
        await dbConfig.authenticate();
        console.log(`Se ha establecido conexión con la DB: ${DB}`);
    } catch (error) {
        console.error("nopudimos conectarnos con la DB ", error)
        process.exit(1)
    }
}
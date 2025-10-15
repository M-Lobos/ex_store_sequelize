import { Model, DataTypes } from "sequelize";

export class Venta extends Model { };

export const initVentas = (dbConfig) => {

    Venta.init(
        //definición de modelo y restrcciones
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            }
        },
        //configuración modelo con sequelize
        {
            sequelize: dbConfig,
            modelName: "Usuario",
            tableName: "usuarios",
            timestamps: true,
            paranoid: true
        }
        
    )
}
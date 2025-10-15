import { Model, DataTypes } from "sequelize";

export class Venta extends Model { };

export const initVenta = (dbConfig) => {

    Venta.init(
        //definición de modelo y restrcciones
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            fecha:{
                type:DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false
            },
            total: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min:0
                }
            }
        },
        //configuración modelo con sequelize
        {
            sequelize: dbConfig,
            modelName: "Venta",
            tableName: "ventas",
            timestamps: true,
            paranoid: true
        }
    )
}
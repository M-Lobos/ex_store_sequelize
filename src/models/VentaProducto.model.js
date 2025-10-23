import { DataTypes, Model } from "sequelize"


export class VentasProductos extends Model { };

export const initVentasProductos = (dbConfig) => {
    VentasProductos.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        subtotal: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        }
    }, {
        sequelize: dbConfig,
        modelName: 'VentasProductos',
        tableName: 'ventas_productos',
        timestamps: true
    }
    )
};
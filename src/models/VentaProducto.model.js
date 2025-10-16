import { DataTypes, Model } from "sequelize"


export class VentaProductos extends Model { };

export const initVentaProducto = (dbConfig) => {

    VentaProductos.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            cantidad: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                    notEmpty: { msg: 'No has ingresado la cantidad de la venta' }
                }
            },
            subtotal: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                    notEmpty: { msg: 'No has ingresado la cantidad de la venta' }
                }
            }
        },
        {
            sequelize: dbConfig,
            modelName: 'VentasProductos',
            tableName: 'ventas_productos',
            timestamps: true
        }
    )
} 
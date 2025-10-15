import { Model, DataTypes } from "sequelize";

export class Producto extends Model { };

export const initProducto = (dbConfig) => {

    Producto.init(
        //primer argumento de init son las columnas y sus restricciones

        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },

            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "El nombre no puede ser un campo vacio" },
                    len: {
                        args: [2, 200],
                        msg: 'El nombre del producto debe tener entre 2 a 200 caracteres'
                    }
                }
            },

            description: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: 'La descripción no puede ser un campo vacío' },
                    len: {
                        args: [0, 300],
                        msg: 'La descripción debe tener máximo 300 caracteres'
                    }
                }
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: { msg: 'El valor del precio no puede ser un campo vacío.' },
                    min: 0
                }
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: { msg: 'El campo stock no puede ser vacío.' },
                    min: 0
                }
            }
        },
            //segundo argumento son las configuraciones del modelo
        {
            sequelize: dbConfig,
            modelName: 'Producto',
            tableName: 'productos',
            timestamps: true,
            paranoid: true
        }
    );

}

import { Model, DataTypes } from "sequelize";


class Usuario extends Model { }

export const initUsuario = () => {
    Usuario.init({
        id: {
            type: DataTypes.UUIDV4,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'El campo nombre, no puede ser un campo vacío' },
                len: {
                    args: [2, 100],
                    msg: 'El campo nombre no puede tener menos de 2 caracteres, ni más de 100'
                },
                is: {
                    args: /^a-zA-ZñÑáéíóúüÜ/,
                    msg: "El nombre sólo puede contener letras del abecedario español"
                }
            }
        },

    })
}


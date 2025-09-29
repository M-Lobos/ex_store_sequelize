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

        apelliedo_paterno: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'El campo apellido paterno, no puede ser un campo vacío' },
                len: {
                    args: [2, 100],
                    msg: 'El campo apellido paterno no puede tener menos de 2 caracteres, ni más de 100'
                },
                isAlpha: true,
            }
        },

        apellido_materno: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [2, 100],
                    msg: 'El campo nombre no puede tener menos de 2 caracteres, ni más de 100'
                },
                isAlpha: true
            }
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'El campo email ingresado ya está en uso'
            },
            validate: {
                notEmpty: {
                    msg: 'El campo correo no puede estar vacío'
                },
                isEmail: {
                    msg: 'El correo ingresado no es válido'
                }
            }
        },
        Telefono: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El campo teléfono no puede estar vacío'
                },
                is: {
                        args: /^(\+56)?(\s?)(8?9)(\s?)[98765432]\d{7}$/,
                        msg: 'El nýmero de teléfono no es válido'
                    },
            },
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }

    })
}


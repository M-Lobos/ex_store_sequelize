import { Model, DataTypes } from "sequelize";

export class Usuario extends Model { }


export const initUsuario = (dbConfig) => {

    Usuario.init(
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
                    notEmpty: { msg: "El nombre no puede ser un campo vacío" },
                    len: {
                        args: [2, 100],
                        msg: "El nombre no puede ser menor a 2 ni mayor a 100 carácteres",
                    },
                    is: {
                        args: /^[a-zA-ZÁ-ÿñÑ\s]+$/,
                        msg: "El nombre solo puede contener letras del abecedario español",
                    },
                },
            },
            apellido_paterno: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "El apellido no puede ser un campo vacío" },
                    len: {
                        args: [2, 50],
                        msg: "El apellido paterno debe tener entre 2 y 50 carácteres",
                    },
                    is: {
                        args: /^[a-zA-ZÁ-ÿñÑ\s]+$/,
                        msg: "El nombre solo puede contener letras del abecedario español",
                    },
                },
            },
            apellido_materno: {
                type: DataTypes.STRING,
                validate: {
                    len: {
                        args: [2, 50],
                        msg: "El apellido materno debe tener entre 2 y 50 carácteres",
                    },
                    is: {
                        args: /^[a-zA-ZÁ-ÿñÑ\s]+$/,
                        msg: "El nombre solo puede contener letras del abecedario español",
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: { msg: "El correo electrónico ingresado ya está en uso" },
                validate: {
                    notEmpty: { msg: "El correo no puede ser un campo vacío" },
                    isEmail: { msg: "El correo electrónico ingresado no es válido" },
                },
            },
            telefono: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "El Teléfono no puede estar vacío" },
                    is: {
                        args: /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/,
                        msg: "El número de teléfono ingresado no es válido",
                    },
                },
            },
        },
        {
            sequelize: dbConfig,
            modelName: "Usuario",
            tableName: "usuarios",
            timestamps: true,
            paranoid: true //habilita softDelete al usar destroy - Agrega un campo nuevo, "deletedAt"
        }
    );

}



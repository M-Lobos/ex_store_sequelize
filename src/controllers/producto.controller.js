import { Producto } from "../models/Producto.model.js"
import { isEmptyResponseData, validateExistData, isAlreadyDeleted } from "../utils/validations/validate.js";


export const createProduct = async (req, res, next) => {
    try {
        const product = await Producto.create(req.body);

        res.status(201).json({
            message: 'Producto creado con éxtio',
            status: 201,
            data: product
        })
    } catch (error) {
        next(error)
    }
}

export const getAllActiveProducts = async (req, res, next) => {
    try {
        const products = await Producto.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']

            }
        })

        isEmptyResponseData(products);
        res.status(200).json({
            message: "Productos disponibles encontrados con éxito",
            status: 200,
            data: products
        })

        console.log(`Productos disponibles: 
            ${JSON.stringify(products, null, 2)}`);
    } catch (error) {
        next(error)
    }
}

export const getActiveProductByID = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Producto.findOne({
            where: { id },
            attributes: {
                exclude: [
                    'createdAt', 'updatedAt', 'deletedAt'
                ]
            }
        })

        res.status(200).json({
            message: `Producto ${product.nombre} encontrado con éxito`,
            status: 200,
            data: product
        })

    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;


        const [updateRows, [updatedProduct]] = await Producto.update(req.body, {
            where: { id },
            returning: true,
            attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        });

        if (updateRows === 0) {
            throw new NotFoundError(
                `No se encontró el producto con ID: ${id} para actualizar`
            );
        }

        res.status(200).json({
            message: `Producto ${updatedProduct.nombre} ha sido actualizado con éxito`,
            status: 200,
            data: updatedProduct,
        });

    } catch (error) {
        next(error)
    }
}

export const productSoftDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Producto.findByPk(id, { paranoid: false });

        isEmptyResponseData(product);

        isAlreadyDeleted(product);

        await product.destroy();

        res.status(200).json({
            message: 'Producto Eliminado con éxito',
            status: 200
        })

    } catch (error) {
        next(error)
    }
}

//filtro básico

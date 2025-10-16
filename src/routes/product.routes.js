import { Router } from "express";
import { createProduct, getActiveProductByID, getAllActiveProducts, getProductosByAdvFilters, getProductosByfilters, productSoftDelete, updateProduct } from "../controllers/producto.controller.js";

const router = Router();

router.post('/', createProduct);
router.get('/', getAllActiveProducts);
router.get('/id/:id', getActiveProductByID);
router.get('/filter/', getProductosByfilters);
router.get('/filter/adv/', getProductosByAdvFilters);
router.put('/id/:id', updateProduct);
router.delete('/id/:id', productSoftDelete);


export default router
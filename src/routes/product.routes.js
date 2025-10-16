import { Router } from "express";
import { createProduct, getActiveProductByID, getAllActiveProducts, productSoftDelete, updateProduct } from "../controllers/producto.controller.js";

const router = Router();

router.post('/', createProduct);
router.get('/', getAllActiveProducts);
router.get('/id/:id', getActiveProductByID);
router.put('/id/:id', updateProduct);
router.delete('/id/:id', productSoftDelete);

export default router
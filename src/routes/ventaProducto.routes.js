import { Router } from "express";
import { createVentaConProductos, getAllSalesWithDetails, getSalesByUserId } from "../controllers/ventas.controller.js";

const router = Router();

router.post('/', createVentaConProductos);
router.get('/', getAllSalesWithDetails);
router.get('/usuario/:usuarioId', getSalesByUserId);

export default router
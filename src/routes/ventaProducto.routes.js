import { Router } from "express";
import { createVentaConProductos } from "../controllers/ventas.controller.js";

const router = Router();

router.post('/', createVentaConProductos)

export default router
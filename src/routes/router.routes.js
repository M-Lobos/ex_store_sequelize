import { Router } from "express";
import userRouter from "./user.routes.js"
import productRouter from "./product.routes.js"
import orderRouter from "./ventaProducto.routes.js"

const router = Router();

router.use('/usuario', userRouter);
router.use('/producto', productRouter);
router.use('/venta', orderRouter)

export default router; 
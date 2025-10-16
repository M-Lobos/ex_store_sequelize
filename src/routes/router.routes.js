import { Router } from "express";
import userRouter from "./user.routes.js"
import productRouter from "./product.routes.js"

const router = Router();

router.use('/usuario', userRouter);
router.use('/producto', productRouter)

export default router; 
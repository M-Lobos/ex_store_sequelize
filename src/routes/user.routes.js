import { Router } from "express";
import { createUser, getActiveUsersById, getAllActiveUsers, updateUser, userSoftDelete } from "../controllers/usuario.controller.js";

const router = Router();

router.post('/usuario', createUser);
router.get('/usuarios', getAllActiveUsers);
router.get('/usuario/id/:id', getActiveUsersById);
router.put('/usuario/id/:id', updateUser)
router.delete('/usuario/id/:id', userSoftDelete);

export default router; 
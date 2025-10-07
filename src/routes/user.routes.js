import { Router } from "express";
import { createUser, getActiveUsersById, getAllActiveUsers, getUserByFilters, updateUser, userSoftDelete } from "../controllers/usuario.controller.js";

const router = Router();

router.post('/usuario', createUser);
router.get('/usuarios', getAllActiveUsers);
router.get('/usuario/id/:id', getActiveUsersById);
router.get('/usuario/filter', getUserByFilters)
router.put('/usuario/id/:id', updateUser)
router.delete('/usuario/id/:id', userSoftDelete);

/* filter */
/* restore */

/* admin */
    /* get all user included deleted */
    /* get user by id included deleted */
    /* physic delete user */


export default router; 
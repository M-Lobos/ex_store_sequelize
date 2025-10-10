import { Router } from "express";
import { createUser, getActiveUsersById, getAllActiveUsers, getAllUsersIncludedDeleted, getDeletedUserById, getUserByFilters, physicDelete, restoreUser, updateUser, userSoftDelete } from "../controllers/usuario.controller.js";

const router = Router();

router.post('/usuario', createUser);
router.get('/usuarios', getAllActiveUsers);
router.get('/usuario/id/:id', getActiveUsersById);
router.get('/usuario/filter', getUserByFilters)
router.put('/usuario/id/:id', updateUser)
router.delete('/usuario/id/:id', userSoftDelete);

/* admin */
/* restore */
router.patch('/usuario/admin/restore/:id', restoreUser);
/* get all user included deleted */
router.get('/usuarios/admin', getAllUsersIncludedDeleted);
/* get user by id included deleted */
router.get('/usuario/id/admin/:id', getDeletedUserById);
/* physic delete user */
router.delete('/usuario/ademin/perma/delete/:id', physicDelete)
/*  soft delete admin */
router.delete('usuario/admin/delete/:id', userSoftDelete);


export default router; 
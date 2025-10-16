import { Router } from "express";
import { createUser, getActiveUsersById, getAllActiveUsers, getAllUsersIncludedDeleted, getDeletedUserById, getUserByFilters, physicDelete, restoreUser, updateUser, userSoftDelete } from "../controllers/usuario.controller.js";

const router = Router();

router.post('/', createUser);
router.get('/', getAllActiveUsers);
router.get('/id/:id', getActiveUsersById);
router.get('/filter', getUserByFilters)
router.put('/id/:id', updateUser)
router.delete('/id/:id', userSoftDelete);

/* admin */
/* restore */
router.patch('/admin/restore/:id', restoreUser);
/* get all user included deleted */
router.get('/admin', getAllUsersIncludedDeleted);
/* get user by id included deleted */
router.get('/id/admin/:id', getDeletedUserById);
/* physic delete user */
router.delete('/admin/perma/delete/:id', physicDelete)
/*  soft delete admin */
router.delete('/admin/delete/:id', userSoftDelete);


export default router; 
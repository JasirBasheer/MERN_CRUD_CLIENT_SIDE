import express from 'express';
import { blockUser, createUser,  deleteUser, editUser, getUsers } from '../controllers/admin/adminController';
import { refreshToken, verifyToken } from '../controllers/admin/tokenController';
import { Login } from '../controllers/admin/authController';
const router = express.Router()

router.post('/verify-token', verifyToken)
router.post('/refresh-token', refreshToken)
router.get('/get-users', getUsers)
router.patch('/edit-user', editUser);
router.post('/login', Login);
router.post('/create-user', createUser);
router.delete('/delete-user/:id', deleteUser);
router.patch('/block-user', blockUser);

export default router;

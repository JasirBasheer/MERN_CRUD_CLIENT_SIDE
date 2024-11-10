import express from 'express';
import { blockUser, createUser, deleteUser, editUser, getUsers } from '../controllers/admin/adminController';
import { refreshToken, verifyToken } from '../controllers/admin/tokenController';
import { Login } from '../controllers/admin/authController';
const router = express.Router()

router.get('/get-users', getUsers)

router.post('/verify-token', verifyToken)

router.post('/create-user', createUser);

router.post('/login', Login);

router.post('/refresh-token', refreshToken)

router.patch('/edit-user', editUser);

router.patch('/block-user', blockUser);

router.delete('/delete-user/:id', deleteUser);


export default router;

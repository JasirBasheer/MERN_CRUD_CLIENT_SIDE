import express from 'express';
import dotenv from 'dotenv';
import { login, register } from '../controllers/user/authController';
import { refreshToken, verifyToken } from '../controllers/user/tokenController';
import { editUser, getUserDetails } from '../controllers/user/userController';

const router = express.Router();
dotenv.config();

router.get('/test',(req,res)=>{
    res.json({message:"Welcome to Mern Crud api"})
})
router.get('/user-details',getUserDetails)
router.patch('/edit-profile',editUser)

router.post('/login',login);
router.post('/register',register);
router.post('/verify-token',verifyToken)
router.post('/refresh-token',refreshToken)

export default router;

import { Request, Response } from 'express';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken'
dotenv.config()



export const Login = async(req: Request, res: Response): Promise<any>=> {
    try {
        const { email, password } = req.body;
        
        
        if (email!=process.env.ADMIN_EMAIL) return res.status(400).json({ error: 'Invalid Email or password' });
        if (password!=process.env.ADMIN_PASSWORD) return res.status(400).json({ error: 'Invalid Email or password' });


        const payload = { admin: process.env.ADMIN_EMAIL,isAdmin:true}
        const AdminAccessToken = Jwt.sign(payload, process.env.JWT_ACEESS_SECRET as string, { expiresIn: '1m' })
        const AdminRefreshToken = Jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' })
      
        res.cookie('AdminRefreshToken', AdminRefreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/',
        });

        return res.status(200).json({ AdminAccessToken, msg: 'Successfully Verified' })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


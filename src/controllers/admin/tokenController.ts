import { Request, Response } from 'express';
import dotenv from 'dotenv';
import Jwt, { TokenExpiredError } from 'jsonwebtoken'
dotenv.config()


export const verifyToken = async (req: Request, res: Response): Promise<any> => {
    try {

        console.log(req.headers['authorization']);

        const token = req.headers['authorization']?.split(' ')[1] as string
        if (!token) return res.sendStatus(400)

        try {
            let isVerified = Jwt.verify(token, process.env.JWT_ACEESS_SECRET as string)
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                console.log('Token expired, please refresh');
                return res.status(402).json({ message: 'Token expired, please refresh' });
            } else {
                return res.status(402).json({ message: 'Invalid token' });
            }
        }
        return res.status(200).json({ msg: 'success' })

    } catch (err) {
        console.log(err)
    }
}


export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const { AdminRefreshToken } = req.cookies;

        if (!AdminRefreshToken) return res.sendStatus(400)

        const isRefreshTokenVerfied = Jwt.verify(AdminRefreshToken, process.env.JWT_REFRESH_SECRET as string)
        if (!isRefreshTokenVerfied) return res.sendStatus(400)

        const payload = { email: (isRefreshTokenVerfied as any).email }
        const newAdminAccessToken = Jwt.sign(payload, process.env.JWT_ACEESS_SECRET as string, { expiresIn: '1m' })

        res.json({ newAdminAccessToken })

    } catch (err) {
        console.log(err)
    }
}

import { Request, Response } from 'express';
import dotenv from 'dotenv';
import User, { IUser } from '../../models/user';
import Jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'
dotenv.config()


export const verifyToken = async (req: Request, res: Response): Promise<any> => {
    try {

        console.log(req.headers['authorization']);

        const token = req.headers['authorization']?.split(' ')[1] as string
        console.log("token")
        console.log(token)

        if (!token) return res.sendStatus(400)

            let isVerified;
            try {
                isVerified = Jwt.verify(token, process.env.JWT_ACEESS_SECRET as string)
            } catch (err) {
                if (err instanceof TokenExpiredError) {                 
                    return res.status(401).json({ message: 'Token expired, please refresh' });
                } 
                    return res.status(400).json({ message: 'Invalid token' });
                
            }

   


        const userId = (isVerified as JwtPayload).user_id;
        console.log(userId)

        const user = await User.findOne({ _id: userId });
        console.log('user')
        console.log(user)
        if (!user) {
            console.log("Somehting went wrong!")
            return res.status(401).json({msg:'error'})

        }
        if(user?.is_blocked){
            console.log('user is blocked');
            
        }



        return res.status(200).json({id:user._id,
                                    email:user.email,
                                    firstName:user.firstName,
                                    lastName:user.lastName,
                                    image:user.image,
                                    msg:'success'})

    } catch (err) {
        console.log(err)
    }
}


export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const { refreshToken } = req.cookies;
        console.log(refreshToken);


        if (!refreshToken) return res.sendStatus(401)

        const isRefreshTokenVerfied = Jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string)
        if (!isRefreshTokenVerfied) return res.sendStatus(401)

        const payload = { user_id: (isRefreshTokenVerfied as any).user_id }
        const newAccessToken = Jwt.sign(payload, process.env.JWT_ACEESS_SECRET as string, { expiresIn: '5m' })

        res.json({ newAccessToken })

    } catch (err) {
        console.log(err)
    }
}


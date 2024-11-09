import { Request, Response } from 'express';
import dotenv from 'dotenv';
import User, { IUser } from '../../models/user';
import Jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
dotenv.config()



export const getUserDetails = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1] as string
        let isVerified;
        try {
            isVerified = Jwt.verify(token, process.env.JWT_ACEESS_SECRET as string)
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                return res.status(401).json({ message: 'Token expired, please refresh' });
            } else {
                return res.status(401).json({ message: 'Invalid token' });
            }
        }
        const userId = (isVerified as JwtPayload).user_id;
        console.log(userId)

        const user = await User.findOne({ _id: userId });
        console.log('user')
        console.log(user)

        return res.status(200).json({ user })

    } catch (error) {

    }
}




export const editUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, firstName, lastName, email, image } = req.body
        console.log("req", req.body);


        const isUserExists = await User.findOne({ email: email })

        if (isUserExists && id !== isUserExists?._id?.toString()) {
            console.log('user Already exists');
            console.log('user Already exists');

            return res.status(400).json({ error: 'User already exists' });
             

        }

        let user = await User.findOne({ _id: id })

        if (user) {
            await User.findByIdAndUpdate(id, { firstName, lastName, email, image })
            return res.status(200).json({ msg: 'success' })

        } else {
            return res.status(404).json({ message: "User not found" });

        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }

}
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User, { IUser } from '../../models/user';
import Jwt from 'jsonwebtoken'
dotenv.config()


export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        const user: IUser | null = await User.findOne({ email });

        if (!user) {
            console.log('usernot found ');
            return res.status(400).json({ error: 'Invalid Email or Password' });
        }
        if (user.is_blocked) {
            return res.status(400).json({ error: 'User is Blocked' });

        }
        const isMatch = user && user.password ? await bcrypt.compare(password, user.password) : false;

        if (!isMatch) {
            console.log('pass isNotMatching');
            return res.status(400).json({ error: 'Invalid Email or Password' });
        }

        const payload = { user_id: user?._id }
        const accessToken = Jwt.sign(payload, process.env.JWT_ACEESS_SECRET as string, { expiresIn: '1m' })
        const refreshToken = Jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });

        console.log(refreshToken);


        res.cookie('refreshToken', refreshToken, {httpOnly: true,sameSite: 'none',secure: true,path: '/',});

        return res.status(200).json({ accessToken, refreshToken, firstName: user.firstName, lastName: user.lastName, email: user.email, id: user._id, msg: 'Successfully Verified' })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}




export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const isUserExists = await User.findOne({ email: email })
        if (isUserExists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: IUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            is_admin: false,
            image: ""
        });

        await newUser.save();
        return res.status(200).json({ msg: 'Successfully Verified' });
    } catch (error) {
        console.error('Error while adding user to the DB:', error);
        return res.status(500).json({ message: 'Error while adding user', error });
    }
}






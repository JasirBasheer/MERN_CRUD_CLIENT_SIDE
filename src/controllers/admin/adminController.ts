import { Request, Response } from 'express';
import User, { IUser } from '../../models/user';
import bcrypt from 'bcrypt';


export const editUser = async(req:Request,res:Response): Promise<any>=>{
try {
    const {id,firstName,lastName,email,image} = req.body
    console.log(req.body);
    

    const isUserExists = await User.findOne({ email: email })
    
    if (isUserExists && id!== isUserExists?._id?.toString()) {
        console.log('user Already exists');
        
        return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.findOne({_id:id})

    if(user){
        await User.findByIdAndUpdate(id, { firstName, lastName, email, image })
        return res.status(200).json({ message: "User updated successfully" });
    }else{
    return res.status(404).json({ message: "User not found" });

    }
    
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
}

}


export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;
        console.log(id);
        const result = await User.findOneAndDelete({ _id: id });
        
        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const blockUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const {id , is_blocked} =req.body

        const result = await User.findByIdAndUpdate(id,{is_blocked:!is_blocked})
        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};




export const getUsers = async(req:Request,res:Response):Promise<any>=>{
    try {
        // const token = req.headers['authorization']?.split(' ')[1] as string
        // let isVerified;
        // try {
        //     isVerified = Jwt.verify(token, process.env.JWT_ACEESS_SECRET as string)
        // } catch (err) {
        //     if (err instanceof TokenExpiredError) {                 
        //         return res.status(401).json({ message: 'Token expired, please refresh' });
        //     } else {
        //         return res.status(401).json({ message: 'Invalid token' });
        //     }
        // }    

        const users = await User.find()
        return res.status(200).json({users})
        
    } catch (error) {
        
    }
}













export const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { firstName,lastName, email,image, password } = req.body;

        const isUserExists = await User.findOne({ email: email })
        if (isUserExists) {
            console.log('user Already exists');
            
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: IUser = new User({
            firstName,
            lastName,
             email,
            password: hashedPassword,
            image,
        });

       await newUser.save();



        return res.status(200).json({ msg: 'Successfully Verified' });
    } catch (error) {
        console.error('Error while adding user to the DB:', error);
        return res.status(500).json({ message: 'Error while adding user', error });
    }
}



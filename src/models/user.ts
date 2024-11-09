import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    image?: string;
    is_blocked : boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image:{
        type:String
    },
   
    is_blocked: {
        type: Boolean,
        default:false
    }
});

export default mongoose.model<IUser>('User', userSchema);

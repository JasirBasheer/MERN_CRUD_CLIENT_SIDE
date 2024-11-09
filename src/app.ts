import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoute';
import adminRoutes from './routes/adminRoute';
import cors from 'cors'
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(cookieParser());


app.use(cors({
    origin: 'https://mern-crud-client-zeta.vercel.app',
    credentials: true, 
  }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/', userRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URI || ""

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error connecting to MongoDB:', err));


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

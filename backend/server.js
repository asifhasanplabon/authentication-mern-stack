import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import connectDB from './config/db.js';
import {errorHandler} from './middleware/errorMiddleware.js';
dotenv.config()
connectDB();

const app=express();

app.use(cors({
    origin:process.env.CLIENT_URL, 
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/api/auth',authRoutes);
app.use('api/students',studentRoutes);

app.get('/',(req,res)=>{
    res.json({
        status:1,
        message: "The backend server works successfully"
    })
})

//urror handler not defined
app.use(errorHandler);

const PORT = process.env.PORT || 7070;
app.listen(PORT,()=>{
    console.log(`The backend server successfully runs at port ${process.env.PORT}`);
})
'use client';
import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
    console.log("connecting to database")
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    }
    
    try {
        await mongoose.connect( process.env.MOGODB_URL! , {
            dbName: process.env.MOGODB_DBNAME,
        })

        isConnected = true;

        console.log('MongoDB connected');
    }catch (error) {
        console.log(error);
    }
}
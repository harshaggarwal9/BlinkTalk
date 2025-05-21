import dotenv from 'dotenv';

import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import { connect } from 'mongoose';
import connectToMongo from './db/connecttomongo.js';

const app = express();
const port = process.env.PORT || 5173;

dotenv.config();

app.use(express.json());
 app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
    connectToMongo();
    console.log(`Server is running on port ${port}`);
});



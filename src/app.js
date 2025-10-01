import express from 'express';
import { serverInit } from './services/serverInit.js';
import userRouter from './routes/user.routes.js';

const app = express();
const PORT = process.env.PORT || 3001

//middleware para formato json y multiformato
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1", userRouter);


serverInit(app, PORT);



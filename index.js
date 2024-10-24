import express, { Router } from 'express';
import { routerMotos } from './routes/index.js';
//import http from 'http'
//import os from 'os';
//import {read, write} from './src/utils/files.js';
//import { nextTick } from 'process';


const app = express();
app.use(express.json());


app.use((req, res, next) => {
    console.log('Middleware');
    next();
})


routerMotos(app);




app.listen(3000, () => {
    console.log("serever is running on port 3000")
})
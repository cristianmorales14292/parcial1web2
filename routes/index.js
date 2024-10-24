import express from "express";
import { motosFileRouter } from "./motos.file.router.js";
const router = express.Router();

export function routerMotos(app){
    app.use("/api/v1", router);

    router.use("/files/motos", motosFileRouter);
}
import { NextFunction , Request , Response} from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "./config"


export const authMiddleware = (req :Request ,res :Response ,next: NextFunction)=>{
    const token = req.headers["authorization"];
    if(!token){
        res.json({
            message:"login first"
        })
    }
    else{
        const decode_info= jwt.verify(token as string ,JWT_SECRET);
        if(decode_info){
            //@ts-ignore
            req.userId=decode_info.id;
            next();
        }
        else{
            res.status(403).json({
                message:"you are not logged in "
            })
        }
    }
    
    
}
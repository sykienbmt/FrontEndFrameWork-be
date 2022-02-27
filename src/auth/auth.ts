import { NextFunction, Request, Response } from 'express';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import { userService } from '../services/UserService';
dotenv.config();


const ACCESS_TOKEN_SECRET= process.env.ACCESS_TOKEN_SECRET || "testToken"

export const verifyToken=(req:Request,res:Response,next:NextFunction)=>{
    const tokenFull=req.headers['authorization'];
    const token=tokenFull?.split(' ')[1]

    if(!token) return res.status(401).json({statusCode:401,mess:"Unauthorized"});
    
    try {
        const data=jwt.verify(token,ACCESS_TOKEN_SECRET)
        req.body.data=data
        next()
    } catch (error) {
        return res.status(401).json({statusCode:401,mess:"Forbidden"});
    }
}

export const verifyAdmin=async (req:Request,res:Response,next:NextFunction)=>{

    const tokenFull=req.headers['authorization'];
    const token=tokenFull?.split(' ')[1]
    
    if(!token) return res.status(401).json({statusCode:401,mess:"Unauthorized"});
    
    try {
        jwt.verify(token,ACCESS_TOKEN_SECRET)
        const obj=parseJwt(token)

        let permission:string="";
        await userService.get(obj.id_user).then(res1=>{
            permission=res1[0].permission
        })
        if(permission==='admin'){
            next()
        }else{
            return res.status(403).json({statusCode:403,mess:"Permission Denied"});
        }
        
        // next()
    } catch (error) {
        return res.status(401).json({statusCode:401,mess:"Forbidden"});
    }

}

const parseJwt =(token:string)=> {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

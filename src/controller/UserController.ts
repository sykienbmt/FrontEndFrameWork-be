import { Request, Response } from 'express';
import { userService } from '../services/UserService';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import User from '../model/User';
dotenv.config();
const argon2= require('argon2');

const ACCESS_TOKEN_SECRET= process.env.ACCESS_TOKEN_SECRET || "testToken"

class UserController{
    create = async (req: Request, res: Response)=>{
        let user:User=req.body
        
        //check username exists
        const checkUser= await userService.check(user.username)
        if(checkUser.length>0){
            return res.status(400).json({success:false,mess:"Your Username is already taken!"})
        }
        // hash password
        user.password=await argon2.hash(user.password)

        //create new user
        await userService.create(user)
        return res.status(200).json({success:true,mess:"Create new user Successfully! "})
    }

    login= async (req: Request,res:Response)=>{
        const {username,password}=req.body

        //check username
        const data =await userService.check(username)

        
        if(data.length<=0){
            return res.status(200).json({success:false,mess:"Incorrect Username!"})
        }
        //check pass
        const passValid=await argon2.verify(data[0].password,password)
        if(!passValid){
            return res.status(200).json({success:false,mess:"Incorrect Pass!"})
        }

        //done
        const id_user=data[0].id_user
        const accessToken=jwt.sign({id_user},ACCESS_TOKEN_SECRET,{expiresIn: '3000s'})
        return res.status(200).json({success:true,mess:"Login done!",accessToken:accessToken})
    }

    get = async (req: Request, res: Response)=> {
        const id_user:string=req.body.id_user
        const data =await userService.get(id_user)
        return res.json(data);
    }

    getMe = async (req:Request,res:Response)=>{
        const token:string=req.headers.authorization || "";

        const idUser= parseJwt(token).id_user
        console.log(idUser);
        
        const data= await userService.get(idUser)
        
        const user:User={
            idUser:data[0].id_user,
            username:data[0].username,
            name:data[0].name,
            address:data[0].address,
            permission:data[0].permission,
            phone:data[0].phone,
            email:data[0].email
        }
        
        return res.json(user)
    }


    list= async (req:Request,res:Response)=>{
        const data =await userService.list()
        return res.json(data)
    }

    admin = async (req:Request,res:Response)=>{
        return res.json("Success")
    }

    edit = async (req:Request,res:Response)=>{
        const user:User = req.body
        await userService.edit(user)
        const data =await userService.list()
        return res.json(data)
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

export const userController = new UserController()


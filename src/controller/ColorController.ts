import { Request, Response } from 'express';
import { userService } from '../services/UserService';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import User from '../model/User';
import { productService } from '../services/ProductService';
import { weightService } from '../services/WeightService';
import { colorService } from '../services/ColorService';
dotenv.config();
const argon2= require('argon2');

const ACCESS_TOKEN_SECRET= process.env.ACCESS_TOKEN_SECRET || "testToken"

class ColorController{
    list = async (req: Request, res: Response)=>{
        const data= await colorService.list()
        return res.status(200).json(data)
    }
}

export const colorController = new ColorController()
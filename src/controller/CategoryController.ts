import { Request, Response } from 'express';
import { userService } from '../services/UserService';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import User from '../model/User';
import { productService } from '../services/ProductService';
import { categoryService } from '../services/CategoryService';
dotenv.config();
const argon2= require('argon2');

const ACCESS_TOKEN_SECRET= process.env.ACCESS_TOKEN_SECRET || "testToken"

class CategoryController{
    list = async (req: Request, res: Response)=>{
        const data= await categoryService.list()

        return res.status(200).json(data)
    }

}

export const categoryController = new CategoryController()
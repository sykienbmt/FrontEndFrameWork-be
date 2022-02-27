import { Request, Response } from 'express';
import dotenv from "dotenv";
import { categoryService } from '../services/CategoryService';
dotenv.config();

const ACCESS_TOKEN_SECRET= process.env.ACCESS_TOKEN_SECRET || "testToken"
class CategoryController{
    list = async (req: Request, res: Response)=>{
        const data= await categoryService.list()
        return res.status(200).json(data)
    }

    edit = async (req: Request, res: Response)=>{   
        await categoryService.edit(req.body)
        const data= await categoryService.list()
        return res.status(200).json(data)
    }
    delete = async (req: Request, res: Response)=>{   
        await categoryService.delete(req.body.idCategory)
        const data= await categoryService.list()
        return res.status(200).json(data)
    }
}
export const categoryController = new CategoryController()
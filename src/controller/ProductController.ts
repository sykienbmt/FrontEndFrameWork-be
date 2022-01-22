import { Request, Response } from 'express';
import { userService } from '../services/UserService';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import User from '../model/User';
import { productService } from '../services/ProductService';
import Image from '../model/Image';
import { ProductLine } from '../model/ProductLine';
import { Product } from '../model/Product';
dotenv.config();
const argon2= require('argon2');

const ACCESS_TOKEN_SECRET= process.env.ACCESS_TOKEN_SECRET || "testToken"

class ProductController{
    list = async (req: Request, res: Response)=>{
        const data= await productService.list(req.body)
        return res.status(200).json(data)
    }

    add = async (req: Request, res: Response)=>{
        const productLine:ProductLine=req.body
        await productService.add(productLine)
        return res.status(200).json("ADD done")
    }

    get = async (req: Request, res: Response)=>{
        const idProductLine=req.body.idProductLine
        const data=await productService.get(idProductLine)
        return res.status(200).json(data)
    }

    updateImage = async (req: Request, res: Response)=>{
        const image:Image=req.body
        await productService.updateImage(image)
        const data=await productService.get(image.idProductLine)
        return res.status(200).json(data)
    }

    updateProduct = async (req: Request, res: Response)=>{
        const product:Product=req.body
        await productService.updateProduct(product)
        const data=await productService.get(product.idProductLine)
        return res.status(200).json(data)
    }

    updateProductLine = async (req: Request, res: Response)=>{
        const productLine:ProductLine=req.body
        await productService.updateProductLine(productLine)
        const data=await productService.get(productLine.idProductLine)
        return res.status(200).json(data)
    }

    deleteProductLine = async (req: Request, res: Response)=>{ 
        const idProductLine:string=req.body.idProductLine
        await productService.deleteProductLine(idProductLine)
        return res.status(200).json({statusCode:200,status:"delete product line done"})
    }

    removeImage= async (req: Request, res: Response)=>{
        const idPicture:string=req.body.idImage
        await productService.deleteImage(idPicture)
        return res.status(200).json({statusCode:200,status:"delete image done"})
    }

    deleteProduct= async (req: Request, res: Response)=>{
        const idProduct:string=req.body.idProduct
        await productService.deleteProduct(idProduct)
        return res.status(200).json({statusCode:200,status:"delete product done"})
    }

}

export const productController = new ProductController()


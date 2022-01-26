import { Request, Response } from 'express';
import { wishListService } from '../services/WishListService';


class WishListController{
    list = async (req: Request, res: Response)=>{
        const data= await wishListService.list(req.body.idUser,req.body.page,req.body.perPage)
        return res.status(200).json(data)
    }

    add = async (req: Request, res: Response)=>{
        await wishListService.add(req.body.idUser,req.body.idProductLine)
        const data= await wishListService.list(req.body.idUser,1,10)
        return res.status(200).json(data)
    }

    delete = async (req: Request, res: Response)=>{
        await wishListService.delete(req.body.idUser,req.body.idProductLine)
        const data= await wishListService.list(req.body.idUser,1,10)
        return res.status(200).json(data)
    }
}

export const wishListController = new WishListController()
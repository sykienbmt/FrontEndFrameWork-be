import { Request, Response } from 'express';
import { OrderProduct } from '../model/OrderProduct';
import { cartService } from '../services/CartService';
const { v4: uuid } = require('uuid');



class CartController{
    
    get = async (req: Request, res: Response) => {
        const data = await cartService.getProductFromCart(req.body.idUser,req.body.idOrder)
        return res.json(data)
    }
    
    add = async (req: Request, res: Response) => {
        let orderProduct:OrderProduct=req.body.orderProduct
        await cartService.add(orderProduct)
        const data = await cartService.getProductFromCart(req.body.idUser,orderProduct.idOrder)
        return res.json(data)
    }
    
    delete = async (req: Request, res: Response) => {
        let {idUser,idProduct,idOrder}=req.body
        await cartService.delete(idProduct,idOrder)
        const data = await cartService.getProductFromCart(idUser,idOrder)
        return res.json(data)
    }
    
    update = async (req: Request, res: Response) => {
        let orderProduct:OrderProduct=req.body.orderProduct
        await cartService.update(orderProduct)
        const data = await cartService.getProductFromCart(req.body.idUser,orderProduct.idOrder)
        return res.json(data)
    }
    
    close = async (req: Request, res: Response) => {
        await cartService.closeCart(req.body.user,req.body.payment,req.body.itemCarts)

        

        const data = await cartService.getProductFromCart(req.body.user.idUser,"")
        return res.json(data)
    }
    
}



export const cartController = new CartController()
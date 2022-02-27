import { Request, Response } from "express";
import { Order } from "../model/Order";
import { orderService } from "../services/OrderService";

class OrderController {
//   update = async (req: Request, res: Response) => {
//     await orderService.update(req.body.id_user, req.body.id_order);
//     return res.json("order done");
//   };

  get = async (req: Request, res: Response) => {
    console.log(req.body);
    
    const idUser: string = req.body.idUser;
    const page: number = Number(req.body.page);
    const perPage: number = Number(req.body.perPage);
    let data = await orderService.get(idUser,page,perPage);
    
    return res.json(data);
  };

  list = async (req: Request, res: Response) => {
    const orderPagination = req.body;
    const { page, perPage } = orderPagination;
    const data = await orderService.list(page, perPage);
    return res.json(data);
  };
}

export const orderController = new OrderController();
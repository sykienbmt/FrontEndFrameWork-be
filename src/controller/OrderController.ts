import { Request, Response } from "express";
import { Order } from "../model/Order";
import { orderService } from "../services/OrderService";

class OrderController {
//   update = async (req: Request, res: Response) => {
//     await orderService.update(req.body.id_user, req.body.id_order);
//     return res.json("order done");
//   };

  get = async (req: Request, res: Response) => {
    const idUser: string = req.body.idUser;
    const page: number = Number(req.body.page);
    const perPage: number = Number(req.body.perPage);
    let data = await orderService.get(idUser,page,perPage);
    return res.json(data);
  };

  list = async (req: Request, res: Response) => {
    const orderPagination = req.body;
    const { page, perPage,search } = orderPagination;
    const data = await orderService.list(page, perPage,search);
    return res.json(data);
  };

  edit = async (req: Request, res: Response) => {
    const idOrder = req.body.idOrder;
    const status = req.body.status;
    await orderService.edit(idOrder,status)
    const data = await orderService.list(1, 10,"");
    return res.json(data);
  };

}

export const orderController = new OrderController();
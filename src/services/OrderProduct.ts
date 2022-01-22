// import { OrderWithDetail } from "./Order";
// import { Product } from "./Product";

import Image from "../model/Image";

export interface OrderProduct{
    idOrder: string,
    idProduct: string,
    quantity:number,
    price:number
}

export interface ItemCart extends OrderProduct{
    nameProductLine:string,
    idProductLine:string,
    weight:string,
    images:Image[]
}

export interface CartInfo {
    idOrder:string,
    itemCarts:ItemCart[]
}
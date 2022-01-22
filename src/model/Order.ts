// import { OrderProduct, OrderProductShow } from "./OrderProduct";
// import { User } from "./User";
import Image from './Image'

// import { OrderProduct } from "./OrderProduct";

export interface Order{
    idOrder:string,
    idUser:string,
    total:number,
    isTemporary:boolean
}

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


export interface OrderInfo extends Order{
    status:string,
    createAt:string,
    closeAt:string,
    email:string,
    name:string,
    phone:string,
    address:string,
    payment:string,
    itemCarts:ItemCart[]
}


// export interface OrderWithDetail extends Order{
//     orderProducts: OrderProductShow[]
// }

// export interface OrderWithDetailAddress extends OrderWithDetail{
//     userInfo:User
// }
// import { OrderWithDetail } from "./Order";
// import { Product } from "./Product";

export interface OrderProduct{
    idOrder: string,
    idProduct: string,
    quantity:number,
    price:number
}

// export interface OrderProductShow extends OrderProduct{
//     product: Product
// }
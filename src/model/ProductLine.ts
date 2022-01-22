import Image from "./Image";
import { Product } from "./Product";

export interface ProductLine{
    idProductLine:string,
    nameProduct:string,
    idCategory:string,
    sell:number,
    desc:string,
    products:Product[],
    pictures: Image[]
}
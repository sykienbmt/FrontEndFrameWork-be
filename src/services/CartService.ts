import { QueryResult } from "pg";
import { pool } from "../dbConnect/db";
import User from "../model/User";
import { CartInfo, ItemCart, OrderProduct } from "./OrderProduct";
const { v4: uuid } = require('uuid');

class CartService{

    add = async (orderProduct:OrderProduct) => {
        const {idOrder,idProduct,quantity,price}=orderProduct
        
        const checkProductExist: QueryResult = await pool.query(`select quantity from order_product op where id_order=$1 and id_product=$2`,[idOrder,idProduct]);
        if(checkProductExist.rows.length==0){
            await pool.query(`insert into order_product values($1,$2,$3,$4,default)`,[idOrder,idProduct,quantity,price]);
        }else{
            await pool.query(`update order_product set quantity=quantity+$1 where id_order=$2 and id_product=$3`,[quantity,idOrder,idProduct]);
        }
    }
    
    delete = async (idProduct:string,idOrder:string) => {
        await pool.query(`delete from order_product where id_order =$1 and id_product =$2`,[idOrder,idProduct]);
    }
    
    
    update = async (order:OrderProduct) => {
        const {idOrder,idProduct,quantity,price}=order
        await pool.query(`update order_product set quantity=$1,price=$2 where id_order=$3 and id_product=$4`,[quantity,price,idOrder,idProduct]);
    }

    getProductFromCart = async (idUser:string,idOrder:string) => {
        let idOrderRaw=idOrder

        if(idOrderRaw===""){
            let getOrder:QueryResult=await pool.query(`select id_order from "order" o where id_user = $1 and is_temporary =true `,[idUser])

            if(getOrder.rows.length===0){
                await pool.query(`insert into "order" values($1,$2,$3,$4,null,default,null,null,null,null,null,null)`,[uuid(),idUser,0,true]);
                getOrder=await pool.query(`select * from "order" where id_user=$1 and is_temporary=true`,[idUser])
            }
            idOrderRaw=getOrder.rows[0].id_order
        }

        const response:QueryResult=await pool.query(`select o.id_order ,pl.id_product_line,p.id_product ,pl.name_product ,to_char(p.price, '99.99') price,p.id_weight,w.weight,
        pp.image,pp.id_picture,op.quantity,pl.name_product
        from product_line pl join product p on pl.id_product_line =p.id_product_line
        join weight w on p.id_weight =w.id_weight
        join product_picture pp on pl.id_product_line = pp.id_product_line
        join order_product op on op.id_product =p.id_product
        join "order" o on o.id_order =op.id_order
        where o.id_order=$1
        order by op."createAt" `,[idOrderRaw]);
        
        const listFull=response.rows
        let listIdProduct:string[]=[]

        listFull.map(item=>listIdProduct.push(item.id_product))
        listIdProduct=Array.from(new Set(listIdProduct))
        
        let itemCarts:ItemCart[]=[]
        listIdProduct.map(item1=>{

            let itemCart:ItemCart={
                idOrder:"",
                idProduct:"",
                nameProductLine:"",
                quantity: 0,
                price:0,
                idProductLine:"",
                weight:"",
                images:[]
            }

            listFull.map(item=>{
                if(item.id_product===item1){
                    itemCart.idOrder=item.id_order,
                    itemCart.idProduct=item.id_product,
                    itemCart.quantity=Number(item.quantity),
                    itemCart.price=Number(item.price),
                    itemCart.nameProductLine=item.name_product
                    itemCart.idProductLine=item.id_product_line
                    itemCart.weight=item.weight
                    itemCart.images.push({idPicture:item.id_picture,idProductLine:item.id_product_line,image:item.image})
                }
            })
            itemCarts.push(itemCart)
        })
        
        let total=0
        let list:ItemCart[]= itemCarts
        list.forEach(item => {
            total+= item.price*item.quantity
        });
        
        return {idOrder:idOrderRaw,count:list.length,itemCarts:list,total:total}
    }

    closeCart = async (user:User,payment:string,itemCart:ItemCart[]) => {
        let idOrder=""
        let total = 0;
        itemCart.map(async item=>{
            total+=item.quantity*item.price ;
            idOrder=item.idOrder
            await pool.query(`update order_product set price=$1 where id_order=$2`,[item.price,item.idOrder])
        })

        await pool.query(`update "order" set "closeAt"=NOW()::timestamp,status='pending',is_temporary=false,total=$7,email=$1,full_name=$2,phone_number=$3,address=$4,payment=$5 where id_order=$6`,[user.email,user.name,user.phone,user.address,payment,idOrder,total])
    }

    

}

export const cartService = new CartService()
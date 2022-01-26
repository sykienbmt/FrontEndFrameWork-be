import { QueryResult } from "pg";
import { pool } from "../dbConnect/db";
import { ProductLine } from "../model/ProductLine";
import { Weight } from "../model/Weight";
const { v4: uuid } = require('uuid');


class WishListService{

    list = async (idUser:string,page:number,perPage:number)=>{
        
        const data:QueryResult = await pool.query(`
        select pl.id_product_line,p.id_product ,pl.name_product,pl."createAt" ,c.id_category,
        c.name_category,c2.id_color ,c2.name_color,pl.sell_count,to_char(p.price, '99.99') price,p.id_weight,w.weight,pp.id_picture,pp.image,pl.description
        from product_line pl join product p on pl.id_product_line =p.id_product_line
            join weight w on p.id_weight =w.id_weight
            join category c on c.id_category =pl.id_category
            join product_picture pp on pl.id_product_line = pp.id_product_line
            join color c2 on c2.id_color =p.id_color
            join wish_list wl on wl.id_product_line=pl.id_product_line
        where p."deleteAt" is null and wl.id_product_line in ( select id_product_line from wish_list where id_user=$1
        order by wl."createAt"
        LIMIT $2 OFFSET (($3-1) * $2))
        `,[idUser,perPage,page])


        let productLines:ProductLine[]=[]

        const listFull=data.rows
        let listIdProductLine:string[]=[]

        listFull.map(item=>listIdProductLine.push(item.id_product_line))
        listIdProductLine=Array.from(new Set(listIdProductLine))

        listIdProductLine.map(idProductLine=>{

            const productLine:ProductLine={
                idProductLine:idProductLine,
                nameProduct:"",
                idCategory:"",
                sell:0,
                desc:"",
                products:[],
                pictures:[]
            }

            listFull.map(item=>{
                if(item.id_product_line===idProductLine){
                    productLine.nameProduct=item.name_product
                    productLine.idCategory=item.id_category
                    productLine.sell=item.sell_count
                    productLine.desc=item.description

                    let index = productLine.products.findIndex(x => x.idProduct === item.id_product);
                    if(index===-1){
                        productLine.products.push({idProduct:item.id_product,
                            idProductLine:item.id_product_line,
                            price:item.price,
                            idWeight:item.id_weight,
                            idColor:item.id_color
                        })
                    }

                    let indexImage = productLine.pictures.findIndex(x => x.idPicture === item.id_picture);

                    if(indexImage===-1){
                        productLine.pictures.push({idPicture:item.id_picture,
                            idProductLine:item.id_product_line,
                            image:item.image
                        })
                    }

                    productLine.products.sort((a, b) => Number(a.price) - Number(b.price))
                }
            })
            productLines.push(productLine)
        })


        const totalProduct=await pool.query(`select count(*) from wish_list where id_user=$1`,[idUser])
        const total=totalProduct.rows[0].count
        
        return {productLines,total}
    }

    add = async(idUser:string,idProductLine:string)=>{
        await pool.query(`insert into wish_list values($1,$2)`,[idUser,idProductLine])
    }

    delete = async(idUser:string,idProductLine:string)=>{
        await pool.query(`delete from wish_list where id_product_line=$1 and id_user= $2`,[idProductLine,idUser]) 
    }

}

export const wishListService = new WishListService()
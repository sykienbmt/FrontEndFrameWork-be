import { privateDecrypt } from "crypto";
import { QueryResult } from "pg";
import { stringify } from "querystring";
import { pool } from "../dbConnect/db";
import Image from "../model/Image";
import { Pagination } from "../model/Pagination";
import { Product } from "../model/Product";
import { ProductLine } from "../model/ProductLine";
import User from "../model/User";
const { v4: uuid } = require('uuid');


class ProductService{
    
    add =async(productLine:ProductLine)=>{
        const {idProductLine,nameProduct,idCategory,sell,desc,products,pictures}=productLine    
        
        let id=uuid();
        await pool.query(`insert into product_line values('${id}',$1,$2,$3,$4,default,null,null)`,[nameProduct,desc,idCategory,sell])
        
        products.map(async item=>{
            await pool.query(`insert into product values($1,$2,$3,$4,$5,default,default,null,null)`,[uuid(),id,item.idWeight,item.idColor,item.price])
        })

        pictures.map(async item=>{
            await pool.query(`insert into product_picture values($1,$2,$3,default,null)`,[uuid(),id,item.image])
        })
    }


    updateImage= async(picture:Image)=>{
        const {idPicture,idProductLine,image}=picture;
        if(idPicture===""){
            await pool.query(`insert into product_picture values($1,$2,$3,default,null)`,[uuid(),idProductLine,image])
            return "Add new picture done"
        }else{
            await pool.query(`update product_picture set image= $1 where id_picture=$2`,[image,idPicture])
            return "edit picture Done"
        }
        
    }

    updateProduct= async (product:Product)=>{
        const {idProduct,idProductLine,idWeight,idColor,price}=product   
        if(idProduct===""){
            await pool.query(`insert into product values($1,$2,$3,$4,$5,default,default,null,null)`,[uuid(),idProductLine,idWeight,idColor,price])
        }else{
            await pool.query(`update product set id_weight=$1,price=$2,id_color=$4,"updateAt"=NOW()::timestamp where id_product=$3`,[idWeight,price,idProduct,idColor])
        }
    }

    updateProductLine=async(productLine:ProductLine)=>{
        await pool.query(`update product_line set name_product=$1,description=$2,id_category=$3,sell_count=$4 where id_product_line=$5`,[productLine.nameProduct,productLine.desc,productLine.idCategory,productLine.sell,productLine.idProductLine])
        return "update product  line done"
    }

    deleteProductLine = async(idProductLine:string)=>{
        await pool.query(`update product_line set "deleteAt"=NOW()::timestamp where id_product_line=$1`,[idProductLine])
        await pool.query(`update product set "deleteAt"=NOW()::timestamp where id_product_line=$1`,[idProductLine])
        await pool.query(`update product_picture set "deleteAt"=NOW()::timestamp where id_product_line=$1`,[idProductLine])
        return "delete product line done"
    }


    deleteImage = async (idPicture:string)=>{
        await pool.query(`delete from product_picture where id_picture=$1`,[idPicture])
        return "delete Image done"
    }

    deleteProduct = async (idProduct:string)=>{
        await pool.query(`update product set "deleteAt"=NOW()::timestamp where id_product=$1`,[idProduct])
        return "delete product done"
    }


    get = async (idProductLine:string)=>{

        const data:QueryResult=await pool.query(`select pl.id_product_line,p.id_product ,pl.name_product,pl."createAt" ,c.id_category,
        c.name_category,pl.sell_count,to_char(p.price, '99.99') price,p.id_weight,w.weight,pp.id_picture,pp.image,pl.description,
        c2.id_color ,c2.name_color 
        from product_line pl join product p on pl.id_product_line =p.id_product_line
        join weight w on p.id_weight =w.id_weight
        join category c on c.id_category =pl.id_category
        join product_picture pp on pl.id_product_line = pp.id_product_line
        join color c2 on c2.id_color =p.id_color
        where pl.id_product_line = $1`,[idProductLine])

        const productLine:ProductLine={
            idProductLine:idProductLine,
            nameProduct:"",
            idCategory:"",
            sell:0,
            desc:"",
            products:[],
            pictures:[]
        }
        let listFull=data.rows

        listFull.map(item=>{
            if(item.id_product_line===idProductLine){
                productLine.nameProduct=item.name_product
                productLine.idCategory=item.id_category
                productLine.sell=item.sell
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

        return productLine
    }



    list = async (pagination:Pagination)=>{
        
        const {page,perPage,search,idCategory,select,from,to}=pagination
        const data:QueryResult = await pool.query(`
        select pl.id_product_line,p.id_product ,pl.name_product,pl."createAt" ,c.id_category,
        c.name_category,c2.id_color ,c2.name_color,pl.sell_count,to_char(p.price, '99.99') price,p.id_weight,w.weight,pp.id_picture,pp.image,pl.description
        from product_line pl join product p on pl.id_product_line =p.id_product_line
        join weight w on p.id_weight =w.id_weight
        join category c on c.id_category =pl.id_category
        join product_picture pp on pl.id_product_line = pp.id_product_line
        join color c2 on c2.id_color =p.id_color
        where p."deleteAt" is null and pl.id_product_line in
        (select id_product_line from product_line where "deleteAt" is null and lower(name_product) ILIKE '%${search}%' and price between $1 and $2 and id_category like '%${idCategory}%'
        order by 
            case when $3='az' then name_product end asc ,
            case when $3='za' then name_product end desc,
            case when $3='ascending' then price end asc,
            case when $3='descending' then price end desc,
            case when $3='sellUp' then sell_count end asc,
            case when $3='sellDown' then sell_count end desc,
            case when $3='createUp' then "createAt" end asc,
            case when $3='createDown' then "createAt" end desc,
            case when $3='updateUp' then "updateAt" end asc,
            case when $3='updateDown' then "updateAt" end desc,
            case when $3='' then "createAt" end desc 
        LIMIT $4 OFFSET (($5-1) * $4))
        order by 
            case when $3='az' then pl.name_product end asc ,
            case when $3='za' then pl.name_product end desc,
            case when $3='ascending' then p.price end asc,
            case when $3='descending' then p.price end desc,
            case when $3='sellUp' then pl.sell_count end asc,
            case when $3='sellDown' then pl.sell_count end desc,
            case when $3='createUp' then pl."createAt" end asc,
            case when $3='createDown' then pl."createAt" end desc,
            case when $3='updateUp' then pl."updateAt" end asc,
            case when $3='updateDown' then pl."updateAt" end desc,
            case when $3='' then pl."createAt" end desc 
        
        `,[from,to,select,perPage,page])


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
        // if(select==="sellUp") productLines.sort((a, b) => Number(b.sell) - Number(a.sell))
        // if(select==="sellDown") productLines.sort((a, b) => Number(a.sell) - Number(b.sell))
        // if(select==="az") productLines.sort((a, b) => a.nameProduct.localeCompare(b.nameProduct))
        // if(select==="za") productLines.sort((a, b) => b.nameProduct.localeCompare(a.nameProduct))

        const totalProduct=await pool.query(`select count(*) from product_line`)
        const total=totalProduct.rows[0].count
        // console.log(productLines[0].products);
        
        return {productLines,total}
    }



}

export const productService = new ProductService()
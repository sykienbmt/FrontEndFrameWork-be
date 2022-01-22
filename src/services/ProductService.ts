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
        
        let id=uuid()

        await pool.query(`insert into product_line values('${id}',$1,$2,$3,$4,default,null)`,[nameProduct,desc,idCategory,sell])
        
        let listProduct:string=""
        products.map(item=>{listProduct+=`('${uuid()}','${id}','${item.idWeight}',${item.price},default,null),`})
        listProduct=listProduct.slice(0, -1)
        
        await pool.query(`insert into product values${listProduct}`)

        let listPicture:string=""
        pictures.map(item=>{listPicture+=`('${uuid()}','${id}','${item.image}',default,null),`})
        listPicture=listPicture.slice(0, -1)
        await pool.query(`insert into product_picture values${listPicture}`)
    }


    updateImage= async(picture:Image)=>{
        console.log(picture);
        
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
        const {idProduct,idProductLine,idWeight,price}=product
        console.log(product);
        
        if(idProduct===""){
            await pool.query(`insert into product values($1,$2,$3,$4,default,null)`,[uuid(),idProductLine,idWeight,price])
            return "Add new product done"
        }else{
            await pool.query(`update product set id_weight=$1,price=$2 where id_product=$3`,[idWeight,price,idProduct])
            return "update product done"
        }
    }

    updateProductLine=async(productLine:ProductLine)=>{
        await pool.query(`update product_line set name_product=$1,description=$2,id_category=$3,sell=$4 where id_product_line=$5`,[productLine.nameProduct,productLine.desc,productLine.idCategory,productLine.sell,productLine.idProductLine])
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
        c.name_category,pl.sell,to_char(p.price, '99.99') price,p.id_weight,w.weight,pp.id_picture,pp.image,pl.description 
        from product_line pl join product p on pl.id_product_line =p.id_product_line
        join weight w on p.id_weight =w.id_weight
        join category c on c.id_category =pl.id_category
        join product_picture pp on pl.id_product_line = pp.id_product_line
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
                        idWeight:item.id_weight
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
        
        const {page,perPage,search,category,sort}=pagination
        let query = `select pl.id_product_line,p.id_product ,pl.name_product,pl."createAt" ,c.id_category,
        c.name_category,pl.sell,to_char(p.price, '99.99') price,p.id_weight,w.weight,pp.id_picture,pp.image,pl.description 
        from product_line pl join product p on pl.id_product_line =p.id_product_line
        join weight w on p.id_weight =w.id_weight
        join category c on c.id_category =pl.id_category
        join product_picture pp on pl.id_product_line = pp.id_product_line
        where p."deleteAt" is null and pl.id_product_line in
        ( select id_product_line from product_line where "deleteAt" is null and name_product like '%${search}%' `

        if(category!==""){ 
            query+=` and id_category = '${category}' `
        }
        if(sort!=="" && sort !== "Ascend"){
            query += ` order by `
            if(sort==="AZ") {
                query +=` name_product asc `
            }else if(sort==="ZA"){
                query +=` name_product desc `
            }else if(sort==="sell"){
                query +=` sell desc`
            }
        }
        query+=` LIMIT $2 OFFSET (($1-1) * $2) )`
        
        const data:QueryResult = await pool.query(query,[page,perPage])

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
                    productLine.sell=item.sell
                    productLine.desc=item.description

                    let index = productLine.products.findIndex(x => x.idProduct === item.id_product);
                    if(index===-1){
                        productLine.products.push({idProduct:item.id_product,
                            idProductLine:item.id_product_line,
                            price:item.price,
                            idWeight:item.id_weight
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
        if(sort==="sell") productLines.sort((a, b) => Number(b.sell) - Number(a.sell))

        const totalProduct=await pool.query(`select count(*) from product_line`)
        const total=totalProduct.rows[0].count

        return {productLines,total}
    }



}

export const productService = new ProductService()
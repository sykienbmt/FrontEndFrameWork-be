import { QueryResult } from "pg";
import { pool} from "../dbConnect/db";
import { Category } from "../model/Category";
const { v4: uuid } = require('uuid');


class CategoryService{
    
    list = async ()=> {
        const list:QueryResult = await pool.query(`select id_category,name_category,description from category where "deleteAt" is null order by "createAt"`)
        let listCategory:Category[]=[];
        list.rows.map(item=>{listCategory.push({idCategory:item.id_category,name:item.name_category,desc:item.description})})
        return listCategory
    }

    edit = async (item:Category)=>{
        if(item.idCategory===""){
            item.idCategory=uuid()
            console.log("add");
            
            await pool.query(`insert into category values($1,$2,$3,default,null)`,[item.idCategory,item.name,item.desc])
            return "insert Done"
        }else{
            console.log("edit");
            await pool.query(`update category set name_category=$1,description=$2 where id_category=$3`,[item.name,item.desc,item.idCategory])
            return 'update done'
        }
    }

    delete = async (idCategory: string)=>{
        await pool.query(`update category set "deleteAt"=now() where "id_category"=$1`,[idCategory])
    }
}

export const categoryService = new CategoryService()
import { QueryResult } from "pg";
import { pool } from "../dbConnect/db";
import { Category } from "../model/Category";
const { v4: uuid } = require('uuid');


class CategoryService{
    
    list = async ()=> {
        const list:QueryResult = await pool.query(`select id_category,name_category,description from category where "deleteAt" is null order by "createAt"`)
        let listCategory:Category[]=[];
        list.rows.map(item=>{listCategory.push({idCategory:item.id_category,name:item.name_category,desc:item.description})})
        return listCategory
    }

}

export const categoryService = new CategoryService()
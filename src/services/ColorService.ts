import { QueryResult } from "pg";
import { pool } from "../dbConnect/db";
import { Color } from "../model/Color";
const { v4: uuid } = require('uuid');


class ColorService{
    list = async ()=> {
        const list:QueryResult = await pool.query(`select id_color,name_color from color where "deleteAt" is null order by "createAt"`)
        let listColor:Color[]=[];
        list.rows.map(item=>{listColor.push({idColor:item.id_color,nameColor:item.name_color})})
        return listColor
    }

}

export const colorService = new ColorService()
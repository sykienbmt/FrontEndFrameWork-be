import { QueryResult } from "pg";
import { pool } from "../dbConnect/db";
import User from "../model/User";
import { Weight } from "../model/Weight";
const { v4: uuid } = require('uuid');


class WeightService{
    list = async ()=> {
        const list:QueryResult = await pool.query(`select id_weight,weight from weight where "deleteAt" is null order by "createAt"`)
        let listWeight:Weight[]=[];
        list.rows.map(item=>{listWeight.push({idWeight:item.id_weight,name:item.weight})})
        return listWeight
    }

}

export const weightService = new WeightService()
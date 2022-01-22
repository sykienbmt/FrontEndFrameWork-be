import { QueryResult } from "pg";
import { pool } from "../dbConnect/db";
import User from "../model/User";
const { v4: uuid } = require('uuid');


class UserService{
    create = async (user:User)=>{
        await pool.query(`insert into "user" values ($1,$2,$3,'user',$4,$5,$6,$7,default,null)`,[user.idUser,user.username,user.password,user.name,user.address,user.phone,user.email])
        return "done"
    }

    get = async (id_user:string)=> {
        const checkUser:QueryResult = await pool.query(`select * from "user" where id_user=$1`,[id_user])
        return checkUser.rows
    }

    check = async (username:string)=>{
        const check:QueryResult= await pool.query(`select * from "user" where username=$1`,[username])
        return check.rows
    }
}

export const userService = new UserService()
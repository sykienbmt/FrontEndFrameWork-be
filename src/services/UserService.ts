import { QueryResult } from "pg";
import { pool } from "../dbConnect/db";
import User from "../model/User";
const { v4: uuid } = require('uuid');


class UserService{
    create = async (user:User)=>{
        console.log(user);
        
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

    list = async ()=> {
        const checkUser:QueryResult = await pool.query(`select * from "user" where "deleteAt" is null order by "createAt"` )
        return checkUser.rows
    } 

    delete = async(id_user:string)=>{
        await pool.query(`update "user" set "deleteAt" = now() where id_user=$1`,[id_user])
    }

    edit = async(user:any)=>{
        await pool.query(`update "user" set username=$1,name=$2,address=$3,phone=$4,email=$5 where id_user=$6`,[user.username,user.name,user.address,user.phone,user.email,user.id_user])
    }
}

export const userService = new UserService()
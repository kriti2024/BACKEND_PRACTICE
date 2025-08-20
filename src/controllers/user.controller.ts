import client from "../config/db.config";
import {Request, Response } from 'express';

interface User {
    id: number;
    username: string;
    address: string;
    contact: string;
    email: string;
}

export const getAllUsers = async(req:Request, res:Response)=> {
    try{
        console.log("Get request received", req.query)
        const {rows, rowCount} = await client.query("SELECT * FROM userdetails");
        return res.status(200).json({
            msg: "User fetched successfully", 
            user: rows, 
            totalCount: rowCount,
        });
    } catch (err) {
        return res.status(500).json({
            msg:"Error is fetching users",
            error: err,
        });
    }
};

export const createUser = async(req:Request, res:Response) => {
    try{
        const {username, address, contact, email} = req.body;

        const {rows} = await client.query(
            'INSERT INTO userdetails (username, address, contact, email) VALUES($1, $2, $3, $4)  RETURNING *', 
            [username, address, contact, email]);

        return res.status(201).json({
            msg:" user added successfully", 
            user:rows[0],
        });
    } catch (err) {
        return res.status(500).json({
            msg: "Error in adding user",
            error: err,
        })
    }
};

export const updateUser = async(req:Request, res:Response) => {
    try{
        const {id} = req.params;
        const {username, address, contact, email} = req.body;

        const userExist = await client.query("SELECT * FROM  userdetails WHERE id=$1", [id])
        if(userExist?.rows?.length<1){
            return res.status(400).json({
                msg: "User not found"
            });
        }

        const {rows} = await client.query(
            'UPDATE userdetails SET username=$1, address=$2, contact=$3, email=$4 WHERE id=$5 RETURNING *', 
            [username, address, contact, email, id]);

        return res.status(200).json({
            msg: "User updated successfully", 
            user:rows[0],
        });
    }catch (err) {
        return res.status(500).json({
            msg: "User not updated",
            error: err,
        })
    }
};


export const deleteUser = async(req:Request, res:Response) => {
    try{
        const {id} = req.params;

        const userExist = await client.query<User>("SELECT * FROM userdetails WHERE id=$1", [id]);

        if(userExist?.rows?.length<1){
            return res.status(400).json({
                msg: "User not found"
            });
        }
        const {rows} = await client.query<User>('DELETE FROM userdetails WHERE id=$1 RETURNING *', [id]);

        return res.status(200).json ({
            msg: "User deleted successfully", 
            user: rows[0],
        });
    }
    catch (err) {
        return res.status(500).json({
            msg: "Cannot delete user",
            error: err,
        })
    }
};

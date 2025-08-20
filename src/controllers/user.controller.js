import client from "../config/db.config.js";

export const getAllUsers = async(req, res)=> {
    console.log("Get request received", req.query)
    const {rows, rowCount} = await client.query("SELECT * FROM userdetails")
    return res.status(200).json({msg: "User fetched successfully", user: rows, totalCount: rowCount})
};

export const createUser = async(req, res) => {
    const {username, address, contact, email} = req.body;
    const {rows} = await client.query('INSERT INTO userdetails (username, address, contact, email) VALUES($1, $2, $3, $4)  RETURNING *', [username, address, contact, email])
    return res.status(200).json({msg:" user added successfully", user:rows})
}

export const updateUser = async(req, res) => {
    const {id} = req.params;
    const {username, address, contact, email} = req.body;
    let userExist = await client.query("SELECT * FROM  userdetails WHERE id=$1, [id]")
    if(userExist?.rows?.length<1){
        return res.status(400).json({msg: "User not found"})
    }
    const {rows} = await client.query('UPDATE userdetails SET username=$1, address=$2, contact=$3, email=$4 WHERE id=$5 RETURNING *', [username, address, contact, email, id]);
     return res.status(200).json({msg: "User updated successfully", user:rows})
}


export const deleteUser = async(req, res) => {
    const {id} = req.params;
    let userExist = await client.query("SELECT * FROM userdetails WHERE id=$1", [id])
    if(userExist?.rows?.length<1){
        return res.status(400).json({msg: "User not found"})
    }
    const {rows} = await client.query('DELETE FROM userdetails WHERE id=$1 RETURNING *', [id]);
    return res.status(200).json ({msg: "User deleted successfully", user: rows})
}

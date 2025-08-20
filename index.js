import router from './src/routes/index.js';
import express from 'express';


const app = express();
app.use(express.json());

const PORT = 3000;

app.use("/api", router)

// app.get('/', async(req, res)=>{
//     console.log("Get request received", req.query)
//     const {rows, rowCount} = await client.query("SELECT * FROM userdetails")
//     return res.status(200).json({msg: "User fetched successfully", user: rows, totalCount: rowCount})
// });


// app.post("/", async(req, res)=>{
//     const {username, address, contact, email} = req.body;
//     const {rows} = await client.query('INSERT INTO userdetails (username, address, contact, email) VALUES ($1, $2, $3, $4) RETURNING *', [username, address, contact, email])
//     return res.status(200).json({msg: "User added successfully", user:rows})
// })


// app.put('/:id', async(req, res) => {
//   const { id } = req.params;
//   const {username, address, contact, email} = req.body;
//   let userExist = await client.query("SELECT * FROM  userdetails WHERE id=$1", [id])
//   if(userExist?.rows?.length<1){
//     return res.status(400).json({msg: "User not found"})
//   }
//    const {rows} = await client.query('UPDATE  userdetails SET username=$1, address=$2, contact=$3, email=$4 WHERE id=$5 RETURNING *', [username, address, contact, email, id]);
//   return res.status(200).json({msg: "User updated successfully", user:rows})
// });

// app.delete('/:id', async(req, res) => {
//     const { id } = req.params;
//     let userExist = await client.query("SELECT * FROM  userdetails WHERE id=$1", [id])
//   if(userExist?.rows?.length<1){
//     return res.status(400).json({msg: "User not found"})
//   }
//    const {rows} = await client.query('DELETE  FROM userdetails WHERE id=$1 RETURNING *', [id]);
//   return res.status(200).json({msg: "User deleted successfully", user:rows})
// });

app.listen(PORT, (error) => {
    if(!error)
        console.log("Server is working successfully" +PORT)

    else
        console.log("Error occurred, error");
})


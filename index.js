 const express = require('express');
 const cors = require('cors');
 const mongoose = require("mongoose");
 require("dotenv").config();
 const app = express();

 app.use(cors());
 app.use(express.json({limit:"10mb"}));


 const PORT = process.env.PORT;

// mongodb connection
console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Connected"))
.catch((err)=>console.log(err))
         

// scheme

const userSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    email:{
        type:String,
        unique:true,
    },
    password: String,
    confirmPassword: String,
    image:String
})

const userModel = mongoose.model("user", userSchema)


 app.get("/", (req, res)=>{
    res.send("Server is running")
 })

 // =======sign up====
 app.post("/signup", async (req, res) => {
    const { email } = req.body;
  
    try {
      const result = await userModel.findOne({ email: email });
  
      if (result) {
        res.send({ message: "Email id is already registered", alert:false });
      } else {
        const data = userModel(req.body);
        const save = await data.save();
        res.send({ message: "Registration is successful", alert:true});
        console.log(save)
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Internal server error" });
    }
  });

  //      ===========login========

  app.post("/login", async (req, res) => {
    try {
      console.log(req.body);
      const { email } = req.body;
      
      const result = await userModel.findOne({ email: email }); 
      if (result) {
        const dataSend = {
          _id:result._id,
          firstName:result.firstName,
          lastName:result.lastName,
          email: result.email,
          image: result.image
        }
        console.log(dataSend);
        return res.send({ message: "Login is successful", alert: true, data: dataSend });
      } else {
        res.send({ message: "User not found", alert: false });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Server Error" });
    }
  });

//=================product section ========

const schemaProduct = mongoose.Schema({
  name:String,
  category:String,
  image:String,
  price:String,
  description:String,
});

const productModel = mongoose.model("product", schemaProduct);

//save product in database
app.post("/uploadProduct", async (req, res)=>{
console.log(req.body)
const data = await productModel(req.body)
const datasave = await data.save();
res.send({message: "Upload successfully"})
})


app.get("/product", async(req, res)=>{
const data = await productModel.find({})
 res.send(data)
})

 app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`);
 })
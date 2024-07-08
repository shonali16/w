import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const deleteUser = (req, res)=>{
    res.send("response frm controller");
}

export const register = async (req, res, next ) => {
    try {
     const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = new User({
        ...req.body,
        password: hash,
    });
    
  
      await newUser.save();
      res.status(201).json({ message: "User has been created" });
    } catch (err) {
        console.error(err); // Log the error
        next(err);
      // res.status(500).json({ error: "Something went wrong" });
    }
  };
  
export const login = async (req,res)=>{

  try{

    const user = await User.findOne({username: req.body.username });
      if (!user) {
        
            return next(createError(404, "User Not found"));
        }


    if(!user) return res.status(400).send("uSer not found");

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
    return next(createError(400, "Wrong password or username!"));

    // JWT token
    const token = jwt.sign({
      id:user._id,
      isSeller:user.isSeller,
    }, process.env.JWT_KEY);

    const {password, ...info} = user._doc;


      res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
    }
  catch(err){
    res.status(500).send("Something went wrong");
    console.log(err);
  }
    
}

// Logout
export const logout = (req,res)=>{
  res.clearCookie("accessToken", {
    sameSite: "none",
    secure:true,

  }).status(200).send("User has been logged out");
    
}
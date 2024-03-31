import { Request, Response } from "express";
import { User } from "../user/user.models";
import { UserType, userSchema } from "../user/user.zodSchema";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { z } from "zod";
import validator from "email-validator";
import { Balance } from "../balance/balance.models";
import { createUserAndBalance } from "./auth.user-balance-service";

const registerHandler = async (req: Request, res: Response) => {

    // ** Get The User Data From Body ;
    const user = req.body;

    // ** destructure the information from user;
    const { name, email, password, confirm } = user as UserType;
    if(name.length == 0)
      return res.json({error:"Name is required"});
    try {
      const parsedUser = await userSchema.parseAsync({
        name,
        email,
        password,
        confirm,
      });
      // ** Check the email all ready exist  in database or not ;
    // ** Import the user model from "./models/user";

    const isEmailAllReadyExist = await User.findOne({
      email: email,
    });

    // ** Add a condition if the user exist we will send the response as email all ready exist
    if (isEmailAllReadyExist) {
      res.json({
        status: 400,
        error: "Email all ready in use",
      });
      return;
    }

    // ** if not create a new user ;
    // !! Don't save the password as plain text in db . I am saving just for demonstration.
    // ** You can use bcrypt to hash the plain password.

    // now create the user;
    await createUserAndBalance(parsedUser)
    // const newUser = await User.create({
    //   name,
    //   email,
    //   password,
    // });

    // const userBalance = await Balance.create({
    //   user: newUser
    // })
    // Send the newUser as  response;
    return res.json({
      status: 201,
      success: true,
      message: "Account Created! \n Please Login!",
    });

    } catch (err) {
      if (err instanceof ZodError) {
        // console.log(err);
        const errorMessage = err.errors.map((err) => err.message).join(", ");
        return res
          
          .json({ error: errorMessage, message: "Some error occurred" });
      } else
        return res.json({ error: "Some Error Occured", err });
    }
};

const loginHandler = async (req: Request, res: Response) => {
  try {
    // ** Get The User Data From Body ;
    const user = req.body;

    // ** destructure the information from user;
    const { email, password } = user;

    const isEmail = validator.validate(email);
    if (!email || !isEmail)
      return res.json({
        status: 401,
        success: false,
        error: "Enter a valid email",
      });

    if (!password)
      return res.json({
        status: 401,
        success: false,
        error: "Enter a password",
      });

    // ** Check the (email/user) exist  in database or not ;
    const isUserExist = await User.findOne({
      email: email,
    });

    // ** if there is not any user we will send user not found;
    if (!isUserExist) {
      return res.json({
        status: 401,
        success: false,
        error: "Invalid Credentials!",
      });
    }

    // ** if the (user) exist  in database we will check the password is valid or not ;
    // **  compare the password in db and the password sended in the request body

    // @ts-ignore
    const isPasswordMatched = await isUserExist.comparePassword(password);

    // ** if not matched send response that wrong password;

    if (!isPasswordMatched) {
      return res.json({
        status: 400,
        success: false,
        error: "Wrong Password",
      });
    }

    // ** if the email and password is valid create a token

    /*
      To create a token JsonWebToken (JWT) receive's 3 parameter
      1. Payload -  This contains the claims or data you want to include in the token.
      2. Secret Key - A secure key known only to the server used for signing the token.
      3. expiration -  Additional settings like token expiration or algorithm selection.
      */

    // !! Don't Provide the secret openly, keep it in the .env file. I am Keeping Open just for demonstration

    // ** This is our JWT Token
    const secret = process.env.SESSION_SECRET || "MY53Cr37K3y";
    const token = jwt.sign(
      { _id: isUserExist?._id, email: isUserExist?.email },
      secret
      //   {
      //     expiresIn: "1d",
      //   }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true, // Mark as secure, only transmit over HTTPS
      sameSite: "strict", // Enforce strict same-site policy
      //   maxAge: 20000, // 1 hour expiration
      path: "/", // Path for the cookie
    });

    // send the response
    return res.json({
      status: 200,
      success: true,
      message: "Logged In Successfully!",
      token: token,
    });
  } catch (error: any) {
    // Send the error message to the client
    return res.json({
      status: 400,
      message: error.message.toString(),
    });
  }
};

const logoutHandler = (req: Request, res: Response) =>{
  res.clearCookie('jwt');
  // Redirect to the home page or any other desired location
  return res.json({message:"Logged Out Successfuly"})
}

export { registerHandler, loginHandler, logoutHandler };

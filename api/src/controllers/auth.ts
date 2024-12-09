import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db/db";
import bcrypt from "bcrypt";
import 'dotenv/config'
const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const createUser = async (req: Request, res: Response) => {

    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        res.status(400).json({ message: "Validation errors" });
        return
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                {email: email},
                {username: username}
            ]
        }
    })

    if(existingUser){
        res.status(409).json({
            error: "Username or email already exists"
        })
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "8h" });

      res.status(201).json({
        access_token: token,
        message: "User successfully registered",
      })

}

export const userLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ 
        message: "Validation errors"
       });
       return
    }
  
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        res.status(404).json({ error: "Invalid email or password" });
        return
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid email or password" });
        return
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "8h" });
  
      res.status(200).json({
        access_token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        }
      });
    
}
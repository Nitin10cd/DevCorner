import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import * as z from "zod";


const RegisterSchema = z.object({
  name: z.string().min(1, { message: "User name required" }).max(20, { message: "Username too long" }),
  email: z.string().email("Invalid email provided"),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(20, { message: "Password too long" }),
  role: z.enum(["USER", "RECRUITER"]),
});

export async function POST (req: Request) {
   try {
         const body = await req.json();
    const result = RegisterSchema.safeParse(body);
    if (!result.success) {
        const errorMessage = result.error.errors.map((err) => err.message);
        return NextResponse.json({error: errorMessage}, {status: 400});
    }

    // getting the validated data 
    const { name , email , password , role } = result.data;
    // checking the existing User
    const existingUserByEmail = await db.user.findUnique({
        where: {
            email: email
        }
    });
    if (existingUserByEmail) return NextResponse.json({success: false , message: "User is Already Exists Change Your Email"}, {status: 409});

    // checking the User by the username / duplicate Username
    const existingUserByUsername = await db.user.findFirst({
        where: {name: name}
    });
    if (existingUserByUsername) return NextResponse.json({success: false, message: "Duplicate the Username"},{status:409});

    // hash the password 
    const hashedPassword = await hash(password, 10);
    // create User
    const user = await db.user.create({
        data: {
            name , email, password: hashedPassword, role
        }
    });
    
    return NextResponse.json({ success: true , user: user ,message: "User registered successfully" }, { status: 201 });
   } catch (error) {
     console.error("[REGISTER_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

   }
}
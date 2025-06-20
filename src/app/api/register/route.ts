import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserSchema } from "@/Schemas/userSchema";

// GET handler
export async function GET() {
  return NextResponse.json({ success: true });
}

export async function POST (req: Request) {
    const body = await req.json();
    const { name , email , password , role } = UserSchema.parse(body);

    const existing = await db.user.findUnique({
        where : {
            email: email
        }
    });

    if (existing) return NextResponse.json({success: false, error: "User is Already Exists"}, {status: 400});
    const hashed = await hash(password,10);
   const user = await db.user.create({
        data: {name, email, password:hashed, role}
    });

    return NextResponse.json({success: true, user: user });
}
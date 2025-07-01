import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const blogSchema = z.object({
    title: z.string().min(4,{message: "Title is required"}),
    content: z.string().min(10,{message: "Content is must required"}),
    tags: z.array(z.string()),
});


export async function  POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({success: false, message: "Unauthorized User"}, {status: 400});

    // const body 
    const body = await req.json();
    const validateSchema = blogSchema.safeParse(body);
    if (!validateSchema.success) return NextResponse.json({success: false, message: "Schema does not match the requirements"}, {status: 404});

    const {title , content, tags} = validateSchema.data;

    
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

    const blog = await db.blog.create({
        data: {
            title,content, tags,slug,userId: session.user.id
        }
    });

    if (!blog) return NextResponse.json({success: false , message: "Blog is not created"}, {status: 500});
    return NextResponse.json({success: true , data: blog, message: "blog is created successsfully"}, {status: 201});
}

export async function  GET(req:NextRequest) {
    try {
        const data = await db.blog.findMany({
            orderBy: {createdAt: "desc"},
            include: {user: true, supports: true, comments: true},
        });
        if (!data) return NextResponse.json({success:false, message: "Error in getting the blogs"},{status: 500});
        return NextResponse.json({success: true, message: "blogs is get successfully", data: data}, {status: 201});
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false , message:`Error in getting the blog ${error}`}, {status:500})
    }
}
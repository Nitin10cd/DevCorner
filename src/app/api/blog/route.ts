import { NextResponse , NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as z from "zod"

const blogSchema = z.object({
    title: z.string().min(1, {message: "Title must be Exists"}).max(100, {message: " Too Much Long title"}),
    content: z.string(),
    tags: z.array(z.string())
})

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // getting the data
    const body = req.json();
    const validated = blogSchema.safeParse(body);
    if (!validated.success) return NextResponse.json({success: false, messgage: validated.error.message});

    const { title , content , tags } = validated.data;
    const blog = await db.blog.create({
        data: {
            title, content,tags , userId: session.user.id
        }
    });

    if (!blog) return NextResponse.json({success: false, message: "Blog is not created successfully"},{status: 404});
    return NextResponse.json({success: true, message: "Blog created Successfully"})
    } catch (error) {
        return NextResponse.json({success: false , message: `Error in catch block ${error}`}, {status: 404});
    }
}


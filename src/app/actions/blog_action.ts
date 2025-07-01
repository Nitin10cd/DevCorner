"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";

// type validation for the blog actions
const commentSchema = z.object({
    blogId: z.string(),
    content: z.string().min(2, { message: "Comment not be empty" }).max(1000, { message: "Comment cant be too long" })
});

// type allocation
type commentData = z.infer<typeof commentSchema>

export async function getUserBlogs() {
    const session = await getServerSession(authOptions);
    const responseFormat = { success: false, message: "Unauthorized User", data: [] };

    if (!session) return responseFormat;

    try {
        const blogsOfUser = await db.blog.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: { supports: true, comments: true }
        });

        return {
            success: true,
            message: "Blogs fetched successfully",
            data: blogsOfUser,
        };
    } catch (error) {
        return {
            success: false,
            message: `Error Occurred: ${error}`,
            data: [],
        };
    }
}

// action for adding the comments
export async function addComment(input: commentData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, message: "User is Not Exists" };

    const validate = await commentSchema.safeParse(input);
    if (!validate.success) {
        throw new Error(JSON.stringify(validate.error.format()));
    }

    const { blogId, content } = validate.data;
    try {
        const comment = await db.comment.create({
            data: {
                content,
                blogId,
                userId: session.user.id
            },
            include: {
                user: true
            }
        });
        return { success: true, data: comment };
    } catch (error) {
        if (!session?.user) return { success: false, message: "Error in adding the comment", error };
    }
}

// toggle for the support 
export async function toggleBlogSupport(blogId: string) {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        // checking the existing support if yes then we can toggle 
        const existing = await db.support.findUnique({
            where: {
                userId_blogId: {
                    userId: session.user.id,
                    blogId
                }
            }
        });

        if (existing) {
            await db.support.delete({where: {id: existing.id}});
            return {success: true , supported: false};
        }else {
            await db.support.create({
                data: {
                    userId: session.user.id,
                    blogId,
                }
            });
            return { success: true, supported: true };
        }
    } catch (error) {
         return { success: false, message: "Support toggle failed" };
    }
}

//  writing the logic for the specific user does it supports the blog or not and all comments show in a blog

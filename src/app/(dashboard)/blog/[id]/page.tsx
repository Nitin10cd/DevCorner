import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import BlogDetails from "../components/BlogDetails"

export default async function BlogPage({ params }: { params: { id: string } }) {
  const blog = await db.blog.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      supports: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!blog) return notFound()

  return <BlogDetails blog={blog} />
}

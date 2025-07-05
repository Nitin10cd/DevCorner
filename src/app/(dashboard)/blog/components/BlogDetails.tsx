"use client"

import { useTransition, useState, useEffect } from "react"
import { toggleBlogSupport, addComment, getAllBlogs } from "@/app/actions/blog_action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function BlogDetailsLayout({ blog }: { blog: any }) {
  const [isPending, startTransition] = useTransition()
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState(blog.comments)
  const [supports, setSupports] = useState(blog.supports)
  const [allBlogs, setAllBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAllBlogs() {
      const result = await getAllBlogs()
      if (result.success) {
        setAllBlogs(result.data)
      } else {
        console.error(result.message)
      }
      setLoading(false)
    }
    fetchAllBlogs()
  }, [])

  const handleSupport = () => {
    startTransition(async () => {
      const res = await toggleBlogSupport(blog.id)
      if (res.success) {
        setSupports((prev) =>
          prev.some((s: any) => s.userId === blog.userId)
            ? prev.filter((s: any) => s.userId !== blog.userId)
            : [...prev, { userId: blog.userId }]
        )
      }
    })
  }

  const handleComment = () => {
    if (!comment) return
    startTransition(async () => {
      const res = await addComment(blog.id, comment)
      if (res.success) {
        setComments((prev: any) => [res.data, ...prev])
        setComment("")
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-6 px-6 py-8 h-[calc(100vh-100px)] overflow-hidden bg-background text-[#fdf4ff]"
    >
      {/* Left Side: All Blogs List */}
      <div className="w-[28%] min-w-[260px] max-w-sm border border-border rounded-2xl p-4 overflow-y-auto bg-card shadow-lg">
        <h2 className="text-xl font-bold mb-5 text-rose-400 tracking-tight">All Blogs</h2>
        {loading ? (
          <p className="text-[#f5c2e7]">Loading...</p>
        ) : allBlogs.length === 0 ? (
          <p className="text-[#f5c2e7]">No blogs found.</p>
        ) : (
          <div className="space-y-3">
            {allBlogs.map((b: any) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  b.id === blog.id ? "bg-muted border border-rose-400" : "hover:bg-muted/50"
                }`}
              >
                <Link href={`/blog/${b.id}`}>
                  <h3 className="font-medium truncate text-[#fdf4ff] hover:text-rose-400">
                    {b.title}
                  </h3>
                </Link>
                <p className="text-xs text-rose-400">
                  {new Date(b.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Right Side: Blog Details */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 overflow-y-auto border border-border rounded-2xl p-6 bg-card shadow-xl"
      >
        <h1 className="text-3xl font-bold text-rose-400 mb-2 leading-tight">
          {blog.title}
        </h1>
        <p className="text-[#f5c2e7] text-sm mb-4">
          By <span className="font-semibold text-rose-300">{blog.user.name || "User"}</span> on {" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <p className="mt-2 text-lg leading-relaxed text-[#fdf4ff]">{blog.content}</p>

        <div className="flex items-center gap-6 mt-6 text-[#f5c2e7]">
          <span className="flex items-center gap-1">👍 {supports.length}</span>
          <span className="flex items-center gap-1">💬 {comments.length}</span>
          <Button onClick={handleSupport} disabled={isPending} className="px-4">
            {isPending ? "..." : "Support"}
          </Button>
        </div>

        {/* Comment Box */}
        <div className="mt-8 space-y-3">
          <Input
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-background border-border text-[#fdf4ff] placeholder-[#f5c2e7]"
          />
          <Button onClick={handleComment} disabled={isPending || !comment}>
            Add Comment
          </Button>
        </div>

        {/* Comment List */}
        <div className="mt-6 space-y-4">
          <AnimatePresence>
            {comments.map((c: any) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="border border-border rounded-xl p-3 bg-muted/30 text-[#fdf4ff]"
              >
                <strong className="text-rose-400">{c.user?.name}:</strong> {c.content}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

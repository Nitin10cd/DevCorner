"use client"

import { useTransition, useState, useEffect } from "react"
import { toggleBlogSupport, addComment, getAllBlogs } from "@/app/actions/blog_action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function BlogDetailsLayout({ blog }: { blog: any }) {
  const [isPending, startTransition] = useTransition();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(blog.comments);
  const [supports, setSupports] = useState(blog.supports);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all blogs (for left sidebar)
  useEffect(() => {
    async function fetchAllBlogs() {
      const result = await getAllBlogs();
      if (result.success) {
        setAllBlogs(result.data);
      } else {
        console.error(result.message);
      }
      setLoading(false);
    }
    fetchAllBlogs();
  }, []);

  // Support
  const handleSupport = () => {
    startTransition(async () => {
      const res = await toggleBlogSupport(blog.id);
      if (res.success) {
        setSupports((prev) =>
          prev.some((s: any) => s.userId === blog.userId)
            ? prev.filter((s: any) => s.userId !== blog.userId)
            : [...prev, { userId: blog.userId }]
        );
      }
    });
  };

  // Comment
  const handleComment = () => {
    if (!comment) return;
    startTransition(async () => {
      const res = await addComment(blog.id, comment);
      if (res.success) {
        setComments((prev: any) => [res.data, ...prev]);
        setComment("");
      }
    });
  };

  return (
    <div className="flex gap-4 px-4 py-6 h-[calc(100vh-100px)] overflow-hidden">
      {/* Left Side: All Blogs List */}
      <div className="w-[30%] min-w-[250px] max-w-sm border rounded-lg p-3 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">All Blogs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : allBlogs.length === 0 ? (
          <p className="text-muted-foreground">No blogs found.</p>
        ) : (
          allBlogs.map((b: any) => (
            <div
              key={b.id}
              className={`p-2 rounded-md hover:bg-muted cursor-pointer ${
                b.id === blog.id ? "bg-muted" : ""
              }`}
            >
              <Link href={`/blog/${b.id}`}><h3 className="font-medium truncate">{b.title}</h3></Link>
              <p className="text-xs text-muted-foreground">
                {new Date(b.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Right Side: Blog Details */}
      <div className="flex-1 overflow-y-auto border rounded-md p-4">
        <h1 className="text-2xl font-bold">{blog.title}</h1>
        <p className="text-muted-foreground text-sm mb-2">
          By {blog.user.name || "User"} on{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <p className="mt-2">{blog.content}</p>

        <div className="flex items-center gap-4 mt-4">
          <span>👍 {supports.length}</span>
          <span>💬 {comments.length}</span>
          <Button onClick={handleSupport} disabled={isPending}>
            {isPending ? "..." : "Support"}
          </Button>
        </div>

        {/* Comment Box */}
        <div className="mt-6 space-y-2">
          <Input
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={handleComment} disabled={isPending || !comment}>
            Add Comment
          </Button>
        </div>

        {/* Comment List */}
        <div className="mt-4 space-y-3">
          {comments.map((c: any) => (
            <div key={c.id} className="border rounded p-2">
              <strong>{c.user?.name}:</strong> {c.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getUserBlogs, deleteBlog } from "@/app/actions/blog_action";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

export default function UserBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's blogs on mount
  useEffect(() => {
    async function fetchBlogs() {
      const result = await getUserBlogs();
      if (result.success) {
        setBlogs(result.data);
      } else {
        console.error(result.message);
      }
      setLoading(false);
    }

    fetchBlogs();
  }, []);

  // Handle blog deletion
  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this blog?");
    if (!confirmed) return;

    const result = await deleteBlog(id);
    if (result.success) {
      setBlogs((prev) => prev.filter((blog: any) => blog.id !== id));
    } else {
      alert(result.message || "Failed to delete blog");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Blogs</h2>

      {blogs.length === 0 ? (
        <p className="text-muted-foreground">You haven’t created any blogs yet.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog: any) => (
            <div
              key={blog.id}
              className="border border-muted rounded-xl p-4 shadow-sm hover:shadow-md transition-all bg-background"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{blog.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(blog.id)}
                  className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                >
                  <Trash2Icon className="w-5 h-5" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-foreground line-clamp-2">{blog.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

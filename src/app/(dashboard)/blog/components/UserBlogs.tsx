"use client";

import { useEffect, useState } from "react";
import { getUserBlogs } from "@/app/actions/blog_action";

export default function UserBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      const result = await getUserBlogs();
      if (result.success) {
        setBlogs(result.data);
        console.log("Blogs fetched successfully", result.data);
      } else {
        console.error(result.message);
      }
      setLoading(false);
    }

    fetchBlogs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Your Blogs</h2>
      {blogs.length === 0 ? (
        <p className="text-muted-foreground">You haven’t created any blogs yet.</p>
      ) : (
        blogs.map((blog: any) => (
          <div key={blog.id} className="border p-3 rounded-lg shadow">
            <h3 className="font-medium">{blog.title}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2 line-clamp-2">{blog.content}</p>
          </div>
        ))
      )}
    </div>
  );
}

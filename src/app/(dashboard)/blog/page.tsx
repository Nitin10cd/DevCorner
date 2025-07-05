"use client";

import { useEffect, useState } from "react";
import { getAllBlogs, getUserBlogs } from "@/app/actions/blog_action";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NewBlogForm from "./components/NewBlogForm";

export default function BlogTabPage() {
  const [allBlogs, setAllBlogs] = useState<any[]>([]);
  const [userBlogs, setUserBlogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    async function fetchBlogs() {
      const all = await getAllBlogs();
      const user = await getUserBlogs();
      if (all.success) setAllBlogs(all.data);
      if (user.success) setUserBlogs(user.data);
    }
    fetchBlogs();
  }, []);

  const filterAndSort = (blogs: any[]) => {
    return blogs
      .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sort === "latest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sort === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else {
          return a.title.localeCompare(b.title);
        }
      });
  };

  const renderBlogs = (blogs: any[]) => (
    <div className="grid gap-4">
      <AnimatePresence>
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition bg-[#1f1f22] border border-border text-[#fdf4ff]">
              <CardContent className="p-4">
                <Link href={`/blog/${blog.id}`}>
                  <h3 className="font-semibold text-rose-400 hover:underline">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-sm text-[#f5c2e7]">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm mt-2 line-clamp-2">{blog.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-12 bg-[#18171ab0] text-[#fdf4ff]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-rose-400">📚 DevCorner Blog Hub</h1>
          <p className="text-[#f5c2e7] text-sm mt-1">
            Toggle between your blogs and all blogs, filter and explore.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create a New Blog</DialogTitle>
            </DialogHeader>
            <NewBlogForm />
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 items-center justify-between">
        <Input
          placeholder="Search by title..."
          className="w-full sm:w-72 bg-[#1f1f22] border-border text-[#fdf4ff] placeholder-[#f5c2e7]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[140px] bg-[#1f1f22] border-border text-[#fdf4ff]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent className="bg-[#2e2e33] text-[#fdf4ff]">
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full sm:w-auto bg-[#3a3a3f] text-[#fdf4ff]">
          <TabsTrigger value="all">🌍 All Blogs</TabsTrigger>
          <TabsTrigger value="yours">📝 Your Blogs</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {filterAndSort(allBlogs).length === 0 ? (
            <p className="text-[#f5c2e7]">No blogs found.</p>
          ) : (
            renderBlogs(filterAndSort(allBlogs))
          )}
        </TabsContent>

        <TabsContent value="yours">
          {filterAndSort(userBlogs).length === 0 ? (
            <p className="text-[#f5c2e7]">
              You haven’t created any blogs yet.
            </p>
          ) : (
            renderBlogs(filterAndSort(userBlogs))
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

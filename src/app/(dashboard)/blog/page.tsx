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

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-12 bg-background">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">📚 DevCorner Blog Hub</h1>
          <p className="text-muted-foreground text-sm mt-1">
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create a New Blog</DialogTitle>
            </DialogHeader>
            <NewBlogForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 items-center justify-between">
        <Input
          placeholder="Search by title..."
          className="w-full sm:w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all">🌍 All Blogs</TabsTrigger>
          <TabsTrigger value="yours">📝 Your Blogs</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {filterAndSort(allBlogs).length === 0 ? (
            <p className="text-muted-foreground">No blogs found.</p>
          ) : (
            <div className="grid gap-4">
              {filterAndSort(allBlogs).map((blog) => (
                <Card key={blog.id} className="hover:shadow-md transition">
                  <CardContent className="p-4">
                    <Link href={`/blog/${blog.id}`}>
                      <h3 className="font-semibold text-primary hover:underline">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-2 line-clamp-2">{blog.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="yours">
          {filterAndSort(userBlogs).length === 0 ? (
            <p className="text-muted-foreground">
              You haven’t created any blogs yet.
            </p>
          ) : (
            <div className="grid gap-4">
              {filterAndSort(userBlogs).map((blog) => (
                <Card key={blog.id} className="hover:shadow-md transition">
                  <CardContent className="p-4">
                    <Link href={`/blog/${blog.id}`}>
                      <h3 className="font-semibold text-primary hover:underline">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-2 line-clamp-2">{blog.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

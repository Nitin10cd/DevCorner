"use client"

import { useEffect, useState } from "react"
import { getAllBlogs } from "@/app/actions/blog_action"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


export default function AllBlogs() {
  const [allBlogs, setAllBlogs] = useState<any[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // filters
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("latest")

  // fetch
  useEffect(() => {
    async function fetchAllBlogs() {
      setLoading(true)
      const result = await getAllBlogs()
      if (result.success) {
        setAllBlogs(result.data)
        setFilteredBlogs(result.data)
        console.log("Blogs fetched successfully", result.data)
      } else {
        console.error(result.message)
      }
      setLoading(false)
    }
    fetchAllBlogs()
  }, [])

  // filter logic
  useEffect(() => {
    let updated = [...allBlogs]

    // Search filter
    if (searchTerm.trim()) {
      updated = updated.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort logic
    if (sortOption === "latest") {
      updated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortOption === "popular") {
      updated.sort((a, b) => (b.supports?.length || 0) - (a.supports?.length || 0))
    }

    setFilteredBlogs(updated)
  }, [searchTerm, sortOption, allBlogs])

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">All Blogs</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by title or content"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2"
        />

        <Select onValueChange={(value) => setSortOption(value)} defaultValue="latest">
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Most Recent</SelectItem>
            <SelectItem value="popular">Most Supported</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blog Cards */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredBlogs.length === 0 ? (
        <p className="text-muted-foreground">No blogs found.</p>
      ) : (
        filteredBlogs.map((blog) => (
          <div key={blog.id} className="border p-3 rounded-lg shadow bg-card">
            <Link href={`/blog/${blog.id}`}>
              <h3 className="font-medium text-blue-600 hover:underline">{blog.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              By {blog.user?.name || "User"} on {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2 line-clamp-2">{blog.content}</p>
            <p className="text-xs mt-1 text-muted-foreground">👍 {blog.supports?.length || 0} supports</p>
          </div>
        ))
      )}
    </div>
  )
}

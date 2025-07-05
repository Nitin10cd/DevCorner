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
} from "@/components/ui/select"
import { motion } from "framer-motion"

export default function AllBlogs() {
  const [allBlogs, setAllBlogs] = useState<any[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("latest")

  useEffect(() => {
    async function fetchAllBlogs() {
      setLoading(true)
      const result = await getAllBlogs()
      if (result.success) {
        setAllBlogs(result.data)
        setFilteredBlogs(result.data)
      } else {
        console.error(result.message)
      }
      setLoading(false)
    }
    fetchAllBlogs()
  }, [])

  useEffect(() => {
    let updated = [...allBlogs]
    if (searchTerm.trim()) {
      updated = updated.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (sortOption === "latest") {
      updated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortOption === "popular") {
      updated.sort((a, b) => (b.supports?.length || 0) - (a.supports?.length || 0))
    }

    setFilteredBlogs(updated)
  }, [searchTerm, sortOption, allBlogs])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6 bg-background text-[#fdf4ff] min-h-screen"
    >
      <h2 className="text-3xl font-bold tracking-tight text-rose-400">📝 All Blogs</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="🔍 Search blogs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 bg-muted text-[#fdf4ff] border border-border placeholder:text-[#a3a3a3]"
        />

        <Select onValueChange={(value) => setSortOption(value)} defaultValue="latest">
          <SelectTrigger className="w-full md:w-[200px] bg-muted text-[#fdf4ff] border border-border">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="bg-muted text-[#fdf4ff] border border-border">
            <SelectItem value="latest">🔥 Most Recent</SelectItem>
            <SelectItem value="popular">❤️ Most Supported</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blog Cards */}
      {loading ? (
        <p className="text-[#a3a3a3]">Loading...</p>
      ) : filteredBlogs.length === 0 ? (
        <p className="text-[#a3a3a3]">No blogs found.</p>
      ) : (
        <div className="space-y-5">
          {filteredBlogs.map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-border bg-card hover:shadow-rose-500/10 hover:shadow-lg transition-all duration-300 rounded-xl p-5"
            >
              <Link href={`/blog/${blog.id}`}>
                <h3 className="font-semibold text-lg text-rose-400 hover:underline">
                  {blog.title}
                </h3>
              </Link>
              <p className="text-sm text-[#a3a3a3] mt-1">
                By {blog.user?.name || "User"} • {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 text-base text-[#f5f3ff]/90 line-clamp-2">{blog.content}</p>
              <p className="text-xs mt-2 text-[#a3a3a3]">👍 {blog.supports?.length || 0} supports</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

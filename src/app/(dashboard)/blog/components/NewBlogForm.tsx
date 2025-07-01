"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import axios from "axios"

const blogSchema = z.object({
  title: z.string().min(4, { message: "Title is required" }),
  content: z.string().min(10, { message: "Content is must required" }),
  tags: z.array(z.string()).nonempty({ message: "At least one tag is required" }),
})

type BlogDataType = z.infer<typeof blogSchema>

export default function NewBlogForm() {
  const [data, setData] = useState({
    title: "",
    content: "",
    tags: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof BlogDataType, string>>>({})
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit() {
    const tagArray = data.tags.split(",").map(tag => tag.trim()).filter(Boolean)

    const parsed = blogSchema.safeParse({
      title: data.title,
      content: data.content,
      tags: tagArray,
    })

    if (!parsed.success) {
      const fieldErrors: any = {}
      parsed.error.errors.forEach(err => {
        const field = err.path[0] as keyof BlogDataType
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setSuccessMsg("")
    setErrorMsg("")

    try {
      const res = await axios.post("/api/blog", {
        title: data.title,
        content: data.content,
        tags: tagArray,
      })

      if (res.data.success) {
        setSuccessMsg("Blog published successfully!")
        setData({ title: "", content: "", tags: "" })
      } else {
        setErrorMsg("Failed to publish blog. Please try again.")
      }
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Something went wrong!")
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 py-8">
      {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

      <div>
        <Input
          placeholder="Title"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div>
        <Textarea
          placeholder="Content"
          rows={6}
          value={data.content}
          onChange={(e) => setData({ ...data, content: e.target.value })}
        />
        {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
      </div>

      <div>
        <Input
          placeholder="Tags (comma separated)"
          value={data.tags}
          onChange={(e) => setData({ ...data, tags: e.target.value })}
        />
        {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
      </div>

      <Button onClick={handleSubmit}>Publish</Button>
    </div>
  )
}

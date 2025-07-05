"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const blogSchema = z.object({
  title: z.string().min(4, { message: "Title is required" }),
  content: z.string().min(10, { message: "Content is must required" }),
  tags: z.array(z.string()).nonempty({ message: "At least one tag is required" }),
});

type BlogDataType = z.infer<typeof blogSchema>;

export default function NewBlogForm() {
  const [data, setData] = useState({ title: "", content: "", tags: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof BlogDataType, string>>>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit() {
    const tagArray = data.tags.split(",").map((tag) => tag.trim()).filter(Boolean);

    const parsed = blogSchema.safeParse({
      title: data.title,
      content: data.content,
      tags: tagArray,
    });

    if (!parsed.success) {
      const fieldErrors: any = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof BlogDataType;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.post("/api/blog", {
        title: data.title,
        content: data.content,
        tags: tagArray,
      });

      if (res.data.success) {
        setSuccessMsg("🎉 Blog published successfully!");
        setData({ title: "", content: "", tags: "" });
      } else {
        setErrorMsg("Failed to publish blog. Please try again.");
      }
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Something went wrong!");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto space-y-6 py-8 px-6 bg-[#1e1e20] rounded-2xl border border-[#2e2e33] shadow-lg"
    >
      <AnimatePresence>
        {successMsg && (
          <motion.p
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-green-400 text-sm"
          >
            {successMsg}
          </motion.p>
        )}
        {errorMsg && (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-sm"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Input
          placeholder="Title"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="bg-background text-[#fdf4ff] placeholder:text-[#aaa]"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Textarea
          placeholder="Write something meaningful..."
          rows={6}
          value={data.content}
          onChange={(e) => setData({ ...data, content: e.target.value })}
          className="bg-background text-[#fdf4ff] placeholder:text-[#aaa]"
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Input
          placeholder="Tags (comma separated)"
          value={data.tags}
          onChange={(e) => setData({ ...data, tags: e.target.value })}
          className="bg-background text-[#fdf4ff] placeholder:text-[#aaa]"
        />
        {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          onClick={handleSubmit}
          className="w-full bg-rose-500 hover:bg-rose-600 transition"
        >
          🚀 Publish Blog
        </Button>
      </motion.div>
    </motion.div>
  );
}

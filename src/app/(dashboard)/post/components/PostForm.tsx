"use client";

import { useState } from "react";
import {
  Upload,
  ImageIcon,
  VideoIcon,
  FileIcon,
  LinkIcon,
  AudioLinesIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

const mediaOptions = [
  { label: "Image", value: "image", icon: <ImageIcon className="w-4 h-4" /> },
  { label: "Video", value: "video", icon: <VideoIcon className="w-4 h-4" /> },
  { label: "PDF", value: "pdf", icon: <FileIcon className="w-4 h-4" /> },
  { label: "Audio", value: "audio", icon: <AudioLinesIcon className="w-4 h-4" /> },
  { label: "Link", value: "link", icon: <LinkIcon className="w-4 h-4" /> },
];

export default function PostForm() {
  const [showForm, setShowForm] = useState(true);
  const [content, setContent] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("mediaType", mediaType);

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("media", file);
      });
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setContent("");
      setFiles(null);
      setMediaType("");
      setShowForm(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foreground">Create Post</h2>
        <Button
          variant="ghost"
          onClick={() => setShowForm(!showForm)}
          className="hover:text-rose-500"
        >
          {showForm ? (
            <>
              <XIcon className="w-5 h-5 mr-1" /> Close
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-1" /> Open
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-muted/40 border border-muted p-6 rounded-2xl shadow-lg backdrop-blur-lg space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="content" className="text-foreground">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="bg-background border-muted text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Media Type</Label>
              <div className="flex gap-2 flex-wrap">
                {mediaOptions.map((option) => {
                  const isSelected = mediaType === option.value;
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "outline"}
                      type="button"
                      onClick={() => setMediaType(option.value)}
                      className={`flex items-center gap-1 text-sm rounded-lg transition-all duration-200 ${
                        isSelected
                          ? "bg-rose-600 text-white hover:bg-rose-700"
                          : "border-muted text-muted-foreground hover:border-rose-500"
                      }`}
                    >
                      {option.icon}
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {mediaType && (
              <div className="space-y-2">
                <Label className="text-foreground">
                  Upload {mediaType === "image" ? "Images" : "File"}
                </Label>
                <Input
                  type="file"
                  multiple={mediaType === "image"}
                  accept={
                    mediaType === "image"
                      ? "image/*"
                      : mediaType === "video"
                      ? "video/*"
                      : mediaType === "pdf"
                      ? "application/pdf"
                      : mediaType === "audio"
                      ? "audio/*"
                      : undefined
                  }
                  onChange={(e) => setFiles(e.target.files)}
                  className="text-muted-foreground file:border-0 file:bg-muted file:text-foreground"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md"
            >
              Post
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

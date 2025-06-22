"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Github, Linkedin, Globe, Pencil, Save } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react";
import { update_profile } from "@/app/actions/update_profie" // make sure spelling is correct!

type ProfileFormProps = {
  name: string;
  email: string;
  bio: string;
  location: string;
  website?: string;
  github?: string;
  linkedin?: string;
};

export default function UserProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session?.user) return <div>Unauthorized</div>;

  const [form, setForm] = useState<ProfileFormProps>({
    name: session.user.name || "",
    email: session.user.email || "",
    bio: "Passionate full-stack developer with a love for clean code.",
    location: "India",
    website: "https://yourportfolio.dev",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourprofile",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedUser = await update_profile(form);
      console.log("Profile Updated:", updatedUser);
      setEditMode(false);
    } catch (error: any) {
      console.error("Update failed:", error.message || error);
      // optionally show toast or alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback>{form.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{form.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{form.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={editMode ? handleSave : () => setEditMode(true)}
            disabled={loading}
          >
            {editMode ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </Button>
        </CardHeader>

        <CardContent className="grid gap-4">
          {editMode ? (
            <>
              <Input name="name" value={form.name} onChange={handleChange} />
              <Input name="email" value={form.email} disabled />
              <Textarea name="bio" value={form.bio} onChange={handleChange} />
              <Input name="location" value={form.location} onChange={handleChange} />
              <Input name="website" value={form.website} onChange={handleChange} />
              <Input name="github" value={form.github} onChange={handleChange} />
              <Input name="linkedin" value={form.linkedin} onChange={handleChange} />
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">{form.bio}</p>
              <p><strong>Location:</strong> {form.location}</p>
              <div className="flex flex-col gap-1 text-sm">
                <a href={form.website} className="text-blue-500 flex items-center gap-1"><Globe size={14} /> {form.website}</a>
                <a href={form.github} className="text-blue-500 flex items-center gap-1"><Github size={14} /> {form.github}</a>
                <a href={form.linkedin} className="text-blue-500 flex items-center gap-1"><Linkedin size={14} /> {form.linkedin}</a>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      
      {/** EXPERIENCE SECTION  */}

      {/** EDUCATION SECTION */}

      {/** Projects SECTION */}

      {/** SKILLS SECCTION */}

    </div>
  );
}

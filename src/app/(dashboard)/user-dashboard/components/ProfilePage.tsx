"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Github, Linkedin, Globe, Pencil } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react";


// TYPES FOR THE USESTATE FORMS 
type ProfileFormProps = {
    name: string;
    email: string;
    bio: string;
    location: string;
    website?:string;
    github?: string;
    linkedin?:string;
}

export default function UserProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session?.user) return <div>Unauthorized</div>;

  // form for the profile 
  const [form, setForm] = useState<ProfileFormProps>({
    name: session.user.name || "",
    email: session.user.email || "",
    bio: "Passionate full-stack developer with a love for clean code.",
    location: "India",
    website: "https://yourportfolio.dev",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourprofile",
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className=" space-y-6 p-6">
        {/**  PROFILE Header */}
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
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Write a short bio..."
          />
        </CardContent>
        </Card>
    </div>
  );
}

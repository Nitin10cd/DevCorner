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
import { useSession } from "next-auth/react"
import { update_profile } from "@/app/actions/update_profie"

// --- Types ---
type ProfileFormProps = {
  name: string
  email: string
  bio: string
  location: string
  website?: string
  github?: string
  linkedin?: string
}

type EducationFormProps = {
  institution: string
  course: string
  startdate: string
  enddate: string
  activity: string
}

// --- Main Component ---
export default function UserProfilePage() {
  const { data: session, status } = useSession()

  if (status === "loading") return <div>Loading...</div>
  if (!session?.user) return <div>Unauthorized</div>

  // --- States ---
  const [form, setForm] = useState<ProfileFormProps>({
    name: session.user.name || "",
    email: session.user.email || "",
    bio: "Passionate full-stack developer with a love for clean code.",
    location: "India",
    website: "https://yourportfolio.dev",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourprofile",
  })

  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)

  const [educations, setEducations] = useState<EducationFormProps[]>([])
  const [newEducationForm, setNewEducationForm] = useState<EducationFormProps>({
    institution: "",
    course: "",
    startdate: "",
    enddate: "",
    activity: "",
  })
  const [eduEditMode, setEduEditMode] = useState(false)

  // --- Profile Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const updatedUser = await update_profile(form)
      console.log("Profile Updated:", updatedUser)
      setEditMode(false)
    } catch (error: any) {
      console.error("Update failed:", error.message || error)
    } finally {
      setLoading(false)
    }
  }

  // --- Education Handlers ---
  const handleNewEduChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEducationForm({ ...newEducationForm, [e.target.name]: e.target.value })
  }

  const addEducation = () => {
    if (
      newEducationForm.institution &&
      newEducationForm.course &&
      newEducationForm.startdate &&
      newEducationForm.enddate
    ) {
      setEducations([...educations, newEducationForm])
      setNewEducationForm({
        institution: "",
        course: "",
        startdate: "",
        enddate: "",
        activity: "",
      })
      setEduEditMode(false)
    } else {
      alert("Please fill all required fields")
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* --- PROFILE CARD --- */}
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

      {/* --- EDUCATION CARD --- */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Education</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setEduEditMode(!eduEditMode)}
          >
            {eduEditMode ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </Button>
        </CardHeader>

        <CardContent className="grid gap-4">
          {educations.length === 0 && !eduEditMode && (
            <p className="text-sm text-muted-foreground">No education added yet.</p>
          )}

          {educations.map((edu, index) => (
            <div key={index} className="border rounded-md p-4 bg-muted/10 space-y-1">
              <p className="font-medium">{edu.institution} — {edu.course}</p>
              <p className="text-sm text-muted-foreground">{edu.startdate} to {edu.enddate}</p>
              <p className="text-sm italic">{edu.activity}</p>
            </div>
          ))}

          {eduEditMode && (
            <>
              <Input
                name="institution"
                placeholder="Institution Name"
                value={newEducationForm.institution}
                onChange={handleNewEduChange}
              />
              <Input
                name="course"
                placeholder="Course / Degree"
                value={newEducationForm.course}
                onChange={handleNewEduChange}
              />
              <Input
                name="startdate"
                placeholder="Start Date (e.g., 2020-08)"
                value={newEducationForm.startdate}
                onChange={handleNewEduChange}
              />
              <Input
                name="enddate"
                placeholder="End Date (e.g., 2024-05)"
                value={newEducationForm.enddate}
                onChange={handleNewEduChange}
              />
              <Textarea
                name="activity"
                placeholder="Clubs, Activities, Honors"
                value={newEducationForm.activity}
                onChange={handleNewEduChange}
              />
              <Button onClick={addEducation}>Add Education</Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Future: EXPERIENCE / SKILLS / PROJECTS SECTION */}
    </div>
  )
}

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
import { update_profile } from "@/app/actions/update_profie";
import { add_education } from "@/app/actions/update_profie"

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
  activity: string[]
}

type ExperienceProps = {
  orgnaisation: string
  role: string
  startdate: string
  enddate: string
  activity: string[]
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
    activity: [],
  });

  const [experience, setExperience] = useState<ExperienceProps[]>([]);
  const [newExperienceForm, setNewExperienceForm] = useState<ExperienceProps>({
    orgnaisation: "",
    role: "",
    startdate: "",
    enddate: "",
    activity: []
  })

  const [eduEditMode, setEduEditMode] = useState(false);
  const [expEditMode, setExpEditMode] = useState(false);


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

  // --- Experience Handlers ---
  const handleNewExpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewExperienceForm({ ...newExperienceForm, [e.target.name]: e.target.value });
  }

  // --- Function for handling the EEducation add form ---
  const addEducation = async () => {
    if (newEducationForm.institution && newEducationForm.course && newEducationForm.startdate && newEducationForm.enddate) {
      try {
        await add_education(newEducationForm);
        setEducations([...educations, newEducationForm]);
        setNewEducationForm({
          institution: "",
          course: "",
          startdate: "",
          enddate: "",
          activity: [""],
        });
        setEduEditMode(false);
      } catch (error) {
        console.error("Error adding education:", error);
      }
    } else {
      alert("please fill all required fields")
    }
  }

  const addExperience = async () => {

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
                placeholder="Clubs, Activities, Honors (comma separated)"
                value={newEducationForm.activity.join(", ")} // show as comma string
                onChange={(e) =>
                  setNewEducationForm({
                    ...newEducationForm,
                    activity: e.target.value.split(",").map(s => s.trim()), // convert to array
                  })
                }
              />


              <Button onClick={addEducation}>Add Education</Button>
            </>
          )}
        </CardContent>
      </Card>
      {/** EXPERIENCE FORM */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Experience</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setExpEditMode(!expEditMode)}
          >
            {expEditMode ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </Button>
        </CardHeader>

        <CardContent className="grid gap-4">
          {experience.length === 0 && !expEditMode && (
            <p className="text-sm text-muted-foreground">No experience added yet.</p>
          )}

          {experience.map((exp, index) => (
            <div key={index} className="border rounded-md p-4 bg-muted/10 space-y-1">
              <p className="font-medium">{exp.orgnaisation} — {exp.role}</p>
              <p className="text-sm text-muted-foreground">{exp.startdate} to {exp.enddate}</p>
              <p className="text-sm italic">{exp.activity.join(", ")}</p>
            </div>
          ))}

          {expEditMode && (
            <>
              <Input
                name="orgnaisation"
                placeholder="Organisation"
                value={newExperienceForm.orgnaisation}
                onChange={handleNewExpChange}
              />
              <Input
                name="role"
                placeholder="Role"
                value={newExperienceForm.role}
                onChange={handleNewExpChange}
              />
              <Input
                name="startdate"
                placeholder="Start Date"
                value={newExperienceForm.startdate}
                onChange={handleNewExpChange}
              />
              <Input
                name="enddate"
                placeholder="End Date"
                value={newExperienceForm.enddate}
                onChange={handleNewExpChange}
              />
              <Textarea
                name="activity"
                placeholder="Clubs, Activities, Honors (comma separated)"
                value={newEducationForm.activity.join(", ")} 
                onChange={(e) =>
                  setNewExperienceForm({
                    ...newExperienceForm, 
                    activity: e.target.value.split(",").map(s => s.trim()),
                  })
                }

              />
              <Button onClick={addExperience}>Add Experience</Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Future: EXPERIENCE / SKILLS / PROJECTS SECTION */}
    </div>
  )
}

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
import { Github, Linkedin, Globe, Pencil, Save, PlusIcon, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { add_project, get_projects, update_profile } from "@/app/actions/update_profie";
import { add_education } from "@/app/actions/update_profie";
import { add_experience } from "@/app/actions/update_profie"
import { get_profile } from "@/app/actions/update_profie";
import { get_education } from "@/app/actions/update_profie";
import { get_Experience } from "@/app/actions/update_profie";
import { Trash } from "lucide-react";
import { get_skills, delete_skill, add_skills } from "@/app/actions/update_profie"


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

type Skill = {
  id: string
  name: string
}

// This is what the DB returns or expects
type Project = {
  id?: string;
  title: string;
  repoUrl: string;
  techTags: string[]; // always array
};

// For form input only (before converting techTags to array)
type NewProject = {
  title: string;
  repoUrl: string;
  techTags: string; 
};



// --- Main Component ---
export default function UserProfilePage() {
  const { data: session, status } = useSession();

  // --- USE EFFECT FOR GETTING THE DATA FROM THE DATABASE WHILE RELOADING OR TRANSITION BETWEEN THE PAGE ---

  const [profileFetchError, setProfileFetchError] = useState<boolean>(false);

  // getting the fetche data
  async function getFetched() {
    try {
      const profileData = await get_profile();
      const educationData = await get_education();
      const experienceData = await get_Experience();

      if (profileData) setForm(profileData);
      if (educationData) setEducations(educationData);
      if (experienceData) setExperience(experienceData);

    } catch (error) {
      console.log("Error fetching:", error);
      setProfileFetchError(true);
    }
  }


  useEffect(() => {
    getFetched();
  }, []);



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

  // -- SKILLS States --- 
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");

  // -- Project Section --
const [projects, setProjects] = useState<Project[]>([]);
const [newProject, setNewProject] = useState<NewProject>({
  title: "",
  repoUrl: "",
  techTags: "",
});

  const [projEditMode, setProjEditMode] = useState(false);

  async function fetchSkills() {
    const data = await get_skills();
    setSkills(data);
  }
  useEffect(() => { fetchSkills() }, []);


  async function handleAddSkill() {
    if (!newSkill?.trim()) return;
    const skill = await add_skills(newSkill);
    setSkills([...skills, skill]);;
    setNewSkill("");
  }

  async function handleDeleteSkill(id: string) {
    await delete_skill(id)
    setSkills(skills.filter((s) => s.id !== id))
  }


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
    if (
      newExperienceForm.orgnaisation &&
      newExperienceForm.role &&
      newExperienceForm.startdate &&
      newExperienceForm.enddate
    ) {
      try {
        await add_experience(newExperienceForm); // <-- backend function
        setExperience([...experience, newExperienceForm]);
        setNewExperienceForm({
          orgnaisation: "",
          role: "",
          startdate: "",
          enddate: "",
          activity: [""],
        });
        setExpEditMode(false);
      } catch (error) {
        console.error("Error adding experience:", error);
      }
    } else {
      alert("Please fill all required fields");
    }
  };


  // handling the delete operation for experiecnce and the education
  const deleteExperience = () => {

  }

  const deleteEducation = () => { }

  // -- HANDLERS OF THE PROJECT --
  const handleProjectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

const handleAddProject = async () => {
  if (!newProject.title || !newProject.repoUrl) return;

  try {
    const added = await add_project({
      title: newProject.title,
      repoUrl: newProject.repoUrl,
      techTags: newProject.techTags.split(",").map((tag) => tag.trim()), // convert to array
    });

    setProjects((prev) => [...prev, added]);
    setNewProject({ title: "", repoUrl: "", techTags: "" });
    setProjEditMode(false);

  } catch (error) {
    console.error("Failed to add project:", error);
  }
};

  const fetchProjects = async () => {
    const p = await get_projects();
    setProjects(p);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
              <p className="text-sm italic">{edu.activity}</p> <br />
              <Button className=" flex justify-center align-middle"> Delete Experience <Trash /> </Button>
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
              <p className="text-sm italic">{exp.activity.join(", ")}</p> <br />
              <Button className=" flex justify-center align-middle"> Delete Experience <Trash /> </Button>
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
                placeholder="Responsibilities, achievements (comma separated)"
                value={newExperienceForm.activity.join(", ")} // Corrected
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

      {/** SKILLS Section  */}

      <Card>
        <CardHeader>
          <CardTitle className=" text-xl "> Skills </CardTitle>
        </CardHeader>
        <CardContent className=" space-y-4">
          <div className=" flex gap-2">
            <Input
              placeholder="Add a Skills"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <Button onClick={handleAddSkill}><PlusIcon /></Button>
          </div>

          {
            skills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No Skills Added Yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2 border px-3 py-1 rounded-md bg-muted text-sm"
                  >
                    {skill.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => handleDeleteSkill(skill.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )
          }

        </CardContent>
      </Card>

      {/* PROJECTS SECTION */}
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Projects</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setProjEditMode(!projEditMode)}
        >
          {projEditMode ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
        </Button>
      </CardHeader>

      <CardContent className="grid gap-4">
        {projects.length === 0 && !projEditMode && (
          <p className="text-sm text-muted-foreground">No projects added yet.</p>
        )}

        {projects.map((project) => (
          <div key={project.id} className="border rounded-md p-4 bg-muted/10">
            <p className="font-medium text-lg">{project.title}</p>
            <p className="text-sm text-blue-600">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                {project.repoUrl}
              </a>
            </p>
            <p className="text-xs mt-2">Tags: {project.techTags.join(", ")}</p>
          </div>
        ))}

        {projEditMode && (
          <div className="space-y-2">
            <Input
              name="title"
              value={newProject.title}
              onChange={handleProjectInput}
              placeholder="Project Title"
            />
            <Input
              name="repoUrl"
              value={newProject.repoUrl}
              onChange={handleProjectInput}
              placeholder="Repository URL"
            />
            <Input
              name="techTags"
              value={newProject.techTags}
              onChange={handleProjectInput}
              placeholder="Tech Tags (comma separated)"
            />
            <Button onClick={handleAddProject}>
              <PlusIcon className="h-4 w-4 mr-2" /> Add Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>



    </div>
  )
}

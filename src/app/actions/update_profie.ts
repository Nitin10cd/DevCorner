//  why i prefer actions this side cuz i want to make simple actions using the ations way
"use server"
import { db } from "@/lib/db";
import * as z from "zod"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

console.log(db);

// --- ZOD VALIDATORS --- 
const profileValidation = z.object({
  name: z.string()
    .min(1, { message: "Username must exist" })
    .max(20, { message: "Too long username" }),
  email: z.string()
    .email("Invalid Email Address"),
  bio: z.string()
    .min(10, { message: "Bio must be at least 10 characters" }),
  location: z.string().optional(),
  website: z.string().url().optional(),
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
});

const projectValidation = z.object({
  title: z.string().min(1,{message: "Title Of Project Must be Exists"}).max(200,{message: "Title cant be too long"}),
  repoUrl: z.string().min(1,{message: "Repo is must exist"}),
  techTags: z.array(z.string()),
})


const educationValidation = z.object({
  institution: z.string()
    .min(1, { message: "Institution name is required" })
    .max(100, { message: "Institution name is too long" }),
  course: z.string()
    .min(1, { message: "Course name is required" })
    .max(100, { message: "Course name is too long" }),
  startdate: z.string(),
  enddate: z.string(),
  activity: z.array(z.string())
});

const experienceValidation = z.object({
  orgnaisation: z.string()
    .min(1, { message: "Institution name is required" })
    .max(100, { message: "Institution name is too long" }),
  role: z.string()
    .min(1, { message: "Course name is required" })
    .max(100, { message: "Course name is too long" }),
  startdate: z.string(),
  enddate: z.string(),
  activity: z.array(z.string())
})


// -- TYPE VALIDATORS ---
// profile data
type profileData = z.infer<typeof profileValidation>
// edducational data
type educationData = z.infer<typeof educationValidation>
// experience data
type experinceData = z.infer<typeof experienceValidation>
// project data
type projectData = z.infer<typeof projectValidation>



// -- ACTIONS FOR THE POST METHODS FOR CREATING PROFILES AND EDUCATION AND EXPERINCE
// function for updating the profile of the user
export async function update_profile(input: profileData) {
  // validate the input
  const validate = await profileValidation.safeParse(input);
  if (!validate.success) {
    throw new Error(JSON.stringify(validate.error.format()));
  }

  const { name, email, bio, location, website, github, linkedin } = validate.data;
  // finding the user
  const user = await db.user.findFirst({
    where: {
      email: email
    }
  });

  if (!user) throw new Error("User is not exists");
  const updateUser = await db.user.update({
    where: { email: email },
    data: {
      name, email, bio, location, website, github, linkedin
    }
  });
  return updateUser;
}

// for updating the education
export async function add_education(data: educationData) {
  // validating the input
  const validate = await educationValidation.safeParse(data);
  if (!validate.success) throw new Error("Validation flied in the adding the education");

  // getting the sessions
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No User Exists till now");

  const user = await db.user.findUnique({
    where: { email: session?.user.email },
  })
  if (!user) throw new Error(" Error in the finding the user i/e user is not exists");

  const newEducation = await db.education.create({
    data: {
      ...data,
      userId: user.id,
    },
  });

  return newEducation

}

// for updating the experience 
export async function add_experience(data: experinceData) {
  const validate = await experienceValidation.safeParse(data);
  if (!validate.success) throw new Error("Validation flied in the adding the education");
  // getting the sessions
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No User Exists till now");

  const user = await db.user.findUnique({
    where: { email: session?.user.email },
  })
  if (!user) throw new Error(" Error in the finding the user i/e user is not exists");

  const newExperience = await db.experience.create({
    data: {
      ...data,
      userId: user.id,
    },
  });

  return newExperience;
}

// --- GET ACTIONS FOR THE PROFILE UPDATION AND EXPERINCE AND THE EDUCATION ---

// get action for the profile
export async function get_profile() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error(" Error in finding the user")
  }

  const user = await db.user.findUnique({
    where: { email: session.user?.email },
    select: {
      name: true,
      email: true,
      image: true,
      bio: true,
      location: true,
      website: true,
      linkedin: true,
      github: true
    }
  });

  if (!user) throw new Error("Error in finding the user in the database");
  return user;

}

// action for the education
export async function get_education() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User is unauthorized");
  const education = await db.education.findMany({
  where: { userId: user.id },
  select: {
    id: true,
    institution: true,
    course: true,
    startdate: true,
    enddate: true,
    activity: true,
  },
});


  return education;
}

// get action for th experience
export async function get_Experience() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User is unauthorized");
  const experience = await db.experience.findMany({
  where: { userId: user.id },
  select: {
    id: true,
    orgnaisation: true,
    role: true,
    startdate: true,
    enddate: true,
    activity: true,
  },
});

  return experience;
}

// --- DELETING ACTIONS FOR THE PROFILE , EDUCATION AND EXPERIENCE --- 
export async function delete_specific_education(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  // checking the education belongs to the user or not
  const education = await db.education.findUnique({
    where: { id },
    include: { user: true }
  });

  if (!education || education?.user.email !== session?.user.email) {
    throw new Error("Not Allowed");
  };
  await db.education.delete({ where: { id } });
  return { success: true };

}

export async function delete_experience(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const experience = await db.experience.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!experience || experience.user.email !== session.user.email) {
    throw new Error("Not allowed")
  }

  await db.experience.delete({ where: { id } })

  return { success: true }
}

// --- UPDATING THE EDUCATION ,  EXPERIENCE  PARTICULAR --
 

// -- SKILLS SECTION ACTIONS ---

//  add the skills
export async function add_skills(name: string ) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = session.user
  const skills = await db.skill.create({
    data: {
      name,
      userId:userId.id,
    }
  });

  return skills;
  
}
// getting the skills 
export async function get_skills () {
  const session  = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const skills = await db.skill.findMany({
    where: { userId: session.user.id },
  })

  return skills;

}

export async function delete_skill(skillId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Unauthorized")

  await db.skill.delete({
    where: {
      id: skillId,
      userId: session.user.id,
    },
  })
}

// -- PROJECT ADD, DELETE AND VIEW ACTION ---\\
export async function add_project (data: projectData) {
  const session = await getServerSession(authOptions);
  if (session?.user) throw new Error("Unauthorized");

  const validate = await projectValidation.safeParse(data);
  if (!validate.success) throw new Error("Data not in correct formate");

  const user = await db.user.findUnique({
    where: {email: session?.user.email}
  });
  if (!user) {
    throw new Error(" User does not exists");
  }

  const project = await db.project.create({
    data: {
      ...data,
      userId: user.id,
    }
  })
  return project;
  
}
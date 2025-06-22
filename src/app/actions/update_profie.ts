//  why i prefer actions this side cuz i want to make simple actions using the ations way
"use server"
import { db } from "@/lib/db";
import * as z from "zod"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

console.log(db);

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

const educationValidation = z.object({
  istitution: z.string()
    .min(1, {message: "Institution Name is Necesary"})
    .max(100, {message: "Too Much long Name for the Instittuation"}),
  course: z.string()
    .min(1, {message: "Institution Name is Necesary"})
    .max(100, {message: "Too Much long Name for the Instittuation"}),
  startdate: z.string(),
  enddate: z.string(),
  activity: z.string()
})

// profile data
type profileData = z.infer<typeof profileValidation>
// edducational data
type educationData = z.infer<typeof educationValidation>
// getting the details of the use to show in the profileSection
export async function getTheProfileInfo() {
    
}

// function for updating the profile of the user
export async function update_profile(input : profileData) {
    // validate the input
    const validate = await profileValidation.safeParse(input);
    if (!validate.success) {
        throw new Error(JSON.stringify(validate.error.format()));
    }

    const {name , email , bio , location , website , github , linkedin} = validate.data;
    // finding the user
    const user  = await db.user.findFirst({
        where: {
            email: email
        }
    });

    if (!user) throw new Error("User is not exists");
    const updateUser = await db.user.update({
        where : {email: email},
        data: {
            name , email , bio , location , website , github , linkedin
        }
    });
    return updateUser;
}

// for updating the education
export async function add_education(input: educationData) {
    // validating the input
    const validate = await educationValidation.safeParse(input);
    if (!validate.success) throw new Error("Validation flied in the adding the education");
    
    // getting the sessions
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("No User Exists till now");

    const user = await db.user.findUnique({
      where: {email: session?.user.email},
    })
    if (!user) throw new Error(" Error in the finding the user i/e user is not exists");

    // 
     const newEducation = await db.education.create({
    data: {
      ...data,
      userId: user.id,
    },
  })

  return newEducation
    
    
}

// for updating the experience 
export async function update_experience() {

}

//  for updating the skills
export async function update_skills() {

}



// for updating the links 
export async function update_contact() {

}
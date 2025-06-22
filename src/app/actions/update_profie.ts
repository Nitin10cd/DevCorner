//  why i prefer actions this side cuz i want to make simple actions using the ations way
"use server"
import { db } from "@/lib/db";
import * as z from "zod"

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

// profile data
type profileData = z.infer<typeof profileValidation>

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

// for updating the experience 
export async function update_experience() {

}

//  for updating the skills
export async function update_skills() {

}

// for updating the education
export async function update_education() {
    
}

// for updating the links 
export async function update_contact() {

}
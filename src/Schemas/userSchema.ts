import * as z from "zod";

export const UserSchema = z.object({
    name: z.string().min(1,"User name is required").max(100,"Not much length required"),
    email: z.string().email("Invalid Email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["USER", "RECRUITER"])
});

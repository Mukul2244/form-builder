import z from "zod";

// create user
export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe("Full name of the user"),
    email: z.email().describe("Email address of the user"),
    password: z.string().describe("Password for the user account"),
});

export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("id for the created user"),
});

// sign in user
export const signInUserWithEmailAndPasswordInputModel = z.object({
    email: z.email().describe("Email address of the user"),
    password: z.string().describe("Password for the user account"),
});

export const signInUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("id for the signed-in user"),
});
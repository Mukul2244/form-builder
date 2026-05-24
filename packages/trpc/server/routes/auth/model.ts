import z from "zod";

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe("Full name of the user"),
    email: z.email().describe("Email address of the user"),
    password: z.string().describe("Password for the user account"),
});

export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("id for the created user"),
});
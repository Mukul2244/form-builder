import z from "zod";

export const createUserWithEmailAndPasswordInput = z.object({
    fullName: z.string().describe("The full name of the user"),
    email: z.string().email().describe("The email address of the user"),
    password: z.string().min(8).describe("The password for the user"),
});

export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>;
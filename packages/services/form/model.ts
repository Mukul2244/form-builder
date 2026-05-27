import { z } from "zod";

// create form 
export const createFormInput = z.object({
  title: z.string().min(1).max(55).describe("The title of the form"),
  description: z.string().max(300).optional().describe("An optional description of the form"),
  createdBy: z.string().uuid().describe("The ID of the user creating the form"),
});
export type CreateFormInputType = z.infer<typeof createFormInput>;

// list forms by user id
export const listFormsByUserIdInput = z.object({
  userId: z.string().describe("UUID of the user whose forms are to be listed"),
});
export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>;



export const getFormByIdInput = z.object({
  formId: z.string().uuid().describe("The ID of the form"),
});

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;

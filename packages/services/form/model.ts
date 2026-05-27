import { z } from "zod";

export const createFormInput = z.object({
  title: z.string().min(1).max(55).describe("The title of the form"),
  description: z.string().max(300).optional().describe("An optional description of the form"),
  createdBy: z.string().uuid().describe("The ID of the user creating the form"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const getFormByIdInput = z.object({
  formId: z.string().uuid().describe("The ID of the form"),
});

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;

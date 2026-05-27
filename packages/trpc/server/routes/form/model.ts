import { z } from "zod";

// Create Form
export const createFormInputModel = z.object({
  title: z.string().min(1).max(55).describe("The title of the form"),
  description: z.string().max(300).optional().describe("An optional description of the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("The ID of the created form"),
});

// Get Forms By User Id (Self)
export const getFormsInputModel = z.undefined();

export const getFormsOutputModel = z.array(z.object({
  id: z.string().uuid().describe("The ID of the form"),
  title: z.string().describe("The title of the form"),
  description: z.string().nullable().describe("The description of the form"),
  createdBy: z.string().uuid().describe("The ID of the user who created it"),
  createdAt: z.date().nullable().describe("The creation date of the form"),
  updatedAt: z.date().nullable().describe("The last updated date of the form")
}));

// Get Form By Id
export const getFormByIdInputModel = z.object({
  id: z.string().uuid().describe("The ID of the form")
});

export const getFormByIdOutputModel = z.object({
  id: z.string().uuid().describe("The ID of the form"),
  title: z.string().describe("The title of the form"),
  description: z.string().nullable().describe("The description of the form"),
  createdBy: z.string().uuid().describe("The ID of the user who created it"),
  createdAt: z.date().nullable().describe("The creation date of the form"),
  updatedAt: z.date().nullable().describe("The last updated date of the form")
});

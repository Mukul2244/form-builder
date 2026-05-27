import { z } from "zod";

export const formSubmissionValueOutputModel = z.object({
  id: z.string().uuid().optional(),
  fieldId: z.string(),
  value: z.string(),
});

export const submitFormInputModel = z.object({
  formId: z.string().uuid(),
  values: z.array(z.object({
      fieldId: z.string(),
      value: z.string(),
  })),
});

export const submitFormOutputModel = z.object({
  id: z.string().uuid(),
  success: z.boolean(),
});

export const getSubmissionsInputModel = z.object({
  formId: z.string().uuid(),
});

export const getSubmissionsOutputModel = z.array(z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  values: z.any(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
}));
import { z } from "zod";

export const formSubmissionValueOutputModel = z.object({
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

export const getFormSubmissionsInputModel = z.object({
    formId: z.string().describe("UUID of the form"),
});

export const getFormSubmissionsOutputModel = z.array(
    z.object({
        id: z.string(),
        createdAt: z.date().nullable(),
        values: z.array(formSubmissionValueOutputModel).nullable(),
    }));
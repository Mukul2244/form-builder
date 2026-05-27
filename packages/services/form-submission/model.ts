import { z } from "zod";

export const formSubmissionValueSchema = z.object({
    fieldId: z.string().describe("The ID of the field"),
    value: z.string().describe("The submitted value for this field"),
});

export const submitFormInput = z.object({
    formId: z.string().describe("The ID of the form being submitted"),
    values: z.array(formSubmissionValueSchema)
        .min(1, "At least one value must be submitted")
        .describe("The submitted values"),
});

export type SubmitFormInputType = z.infer<typeof submitFormInput>;

export const getFormSubmissionsInput = z.object({
    formId: z.string().describe("The ID of the form to view submissions for"),
});

export type GetFormSubmissionsInputType = z.infer<typeof getFormSubmissionsInput>;
import { z } from "zod";

const fieldTypeEnum = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);

// #region create form field
export const createFieldInput = z.object({

    label: z.string().min(1).max(100).describe("The label of the field"),
    type: fieldTypeEnum.describe("The type of the field"),
    formId: z.string().describe("The ID of the form this field belongs to"),
    description: z.string().optional().describe("Optional description for the field"),
    placeholder: z.string().optional().describe("Optional placeholder text"),
    isRequired: z.boolean().optional().default(false).describe("Whether the field is required"),
});
export type CreateFieldInputType = z.infer<typeof createFieldInput>;

// #endregion

// #region get form fields
export const getFieldsInput = z.object({
    formId: z.string().describe("The ID of the form to list fields for"),
});
export type GetFieldsInputType = z.infer<typeof getFieldsInput>;

// #endregion

// #region update form field
export const updateFieldInput = z.object({
    fieldId: z.string().describe("The ID of the field to update"),
    label: z.string().min(1).max(100).optional().describe("updated display label"),
    description: z.string().optional().nullable().describe("updated description for the field"),
    placeholder: z.string().optional().nullable().describe("updated placeholder text"),
    isRequired: z.boolean().optional().describe("updated required status"),
    type: fieldTypeEnum.optional().describe("updated type of the field"),
});
export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;
// #endregion

// #region delete form field
export const deleteFieldInput = z.object({
    fieldId: z.string().describe("The ID of the field to delete"),
});
export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>;

// #endregion
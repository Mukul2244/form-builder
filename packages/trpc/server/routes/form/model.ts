import { z } from "zod";

const fieldTypeEnum = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);

// #region Create Form
export const createFormInputModel = z.object({
  title: z.string().min(1).max(55).describe("The title of the form"),
  description: z.string().max(300).optional().describe("An optional description of the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("The ID of the created form"),
});
// #endregion


// #region List Forms By User ID
export const listFormsByUserIdInputModel = z.undefined();

export const listFormsByUserIdOutputModel = z.array(z.object({
  id: z.string().uuid().describe("The ID of the form"),
  title: z.string().describe("The title of the form"),
  description: z.string().nullable().describe("The description of the form"),
  createdAt: z.date().nullable().describe("The creation date of the form"),
  updatedAt: z.date().nullable().describe("The last updated date of the form")
}));
// #endregion

// #region Get Form By ID
export const getFormByIdInputModel = z.object({
  id: z.string().describe("The ID of the form"),
});

export const getFormByIdOutputModel = z.object({
  id: z.string().describe("The ID of the form"),
  title: z.string().describe("The title of the form"),
  description: z.string().nullable().describe("The description of the form"),
  createdBy: z.string().uuid().describe("The ID of the user who created it"),
  createdAt: z.date().nullable().describe("The creation date of the form"),
  updatedAt: z.date().nullable().describe("The last updated date of the form"),
  fields: z.array(z.object({
    id: z.string(),
    label: z.string(),
    labelKey: z.string(),
    description: z.string().nullable(),
    placeholder: z.string().nullable(),
    isRequired: z.boolean(),
    orderIndex: z.string().nullable(),
    type: z.string(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  }))
});
// #endregion

// #region Get Public Form By ID
export const getPublicFormByIdInputModel = z.object({
  id: z.string().describe("The ID of the form"),
});

export const getPublicFormByIdOutputModel = z.object({
  id: z.string().uuid().describe("The ID of the form"),
  title: z.string().describe("The title of the form"),
  description: z.string().nullable().describe("The description of the form"),
  fields: z.array(z.object({
    id: z.string().uuid(),
    label: z.string(),
    labelKey: z.string(),
    description: z.string().nullable(),
    placeholder: z.string().nullable(),
    isRequired: z.boolean(),
    orderIndex: z.string().nullable(),
    type: z.string(),
  }))
});
// #endregion

// #region Form Fields
export const createFieldInputModel = z.object({
  formId: z.string().describe("The ID of the form this field belongs to"),
  label: z.string().min(1).max(100).describe("The label of the field"),
  type: fieldTypeEnum.describe("The type of the field"),
  description: z.string().optional().describe("Optional description for the field"),
  placeholder: z.string().optional().describe("Optional placeholder text"),
  isRequired: z.boolean().optional().default(false).describe("Whether the field is required"),
});

export const createFieldOutputModel = z.object({
  id: z.string().describe("The ID of the created field"),
});

export const getFieldsInputModel = z.object({
    formId: z.string().describe("The ID of the form to list fields for"),
});

export const getFieldsOutputModel = z.array(z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  label: z.string(),
  labelKey: z.string(),
  description: z.string().nullable(),
  placeholder: z.string().nullable(),
  isRequired: z.boolean(),
  orderIndex: z.string().nullable(),
  type: z.string(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
}));

export const updateFieldInputModel = z.object({
  fieldId: z.string().describe("The ID of the field to update"),
  label: z.string().min(1).max(100).optional(),
  type: fieldTypeEnum.optional(),
  description: z.string().optional().nullable(),
  placeholder: z.string().optional().nullable(),
  isRequired: z.boolean().optional(),
});

export const updateFieldOutputModel = z.object({
  id: z.string().describe("The ID of the updated field"),
});

export const deleteFieldInputModel = z.object({
  fieldId: z.string().describe("The ID of the field to delete"),
});

export const deleteFieldOutputModel = z.object({
  id: z.string().describe("The ID of the deleted field"),
});
// #endregion

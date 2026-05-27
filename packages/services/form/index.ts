import { db, eq } from "@repo/database";
import { formsTable, formFieldsTable } from "@repo/database/schema";
import { 
    createFormInput, 
    listFormsByUserIdInput, 
   type ListFormsByUserIdInputType, 
    type CreateFormInputType
} from "./model";

class FormService {
    public async createForm(payload: CreateFormInputType) {
        const { title, description, createdBy } = await createFormInput.parseAsync(payload);

        const formInsertResult = await db
            .insert(formsTable)
            .values({
                title,
                description,
                createdBy,
            })
            .returning({
                id: formsTable.id,
            });

        if (!formInsertResult || formInsertResult.length === 0 || !formInsertResult[0]?.id) {
            throw new Error("Failed to create form");
        }

        return {
            id: formInsertResult[0].id,
        }
    }

    public async listFormsByUserId(payload: ListFormsByUserIdInputType) {
        const { userId } = await listFormsByUserIdInput.parseAsync(payload);

        const forms = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt
            })
            .from(formsTable)
            .where(eq(formsTable.createdBy, userId));

        return forms;
    }

    public async getFormById(formId: string, userId: string) {
        const result = await db
            .select()
            .from(formsTable)
            .where(eq(formsTable.id, formId));

        const form = result?.[0];
        if (!form) {
            throw new Error("Form not found");
        }

        // Ensure the form belongs to the user requesting it
        if (form.createdBy !== userId) {
            throw new Error("Unauthorized to access this form");
        }

        const fields = await db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(formFieldsTable.orderIndex);

        return { ...form, fields };
    }

    public async getPublicFormById(formId: string) {
        const result = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
            })
            .from(formsTable)
            .where(eq(formsTable.id, formId));

        const form = result?.[0];
        if (!form) {
            throw new Error("Form not found");
        }

        const fields = await db
            .select({
                id: formFieldsTable.id,
                label: formFieldsTable.label,
                labelKey: formFieldsTable.labelKey,
                description: formFieldsTable.description,
                placeholder: formFieldsTable.placeholder,
                isRequired: formFieldsTable.isRequired,
                orderIndex: formFieldsTable.orderIndex,
                type: formFieldsTable.type,
            })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(formFieldsTable.orderIndex);

        return { ...form, fields };
    }
}

export default FormService;

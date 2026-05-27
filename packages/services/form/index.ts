import { db, eq } from "@repo/database";
import { formsTable } from "@repo/database/schema";
import { createFormInput, type CreateFormInputType } from "./model";

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

    public async getFormsByUserId(userId: string) {
        const forms = await db
            .select()
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

        return form;
    }
}

export default FormService;

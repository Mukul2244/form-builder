import { db, eq, max } from "@repo/database";
import { formFieldsTable } from "@repo/database/schema";
import {
    createFieldInput, CreateFieldInputType,
    getFieldsInput, GetFieldsInputType,
    updateFieldInput, UpdateFieldInputType,
    deleteFieldInput, DeleteFieldInputType,
    updateFieldOrderInput, UpdateFieldOrderInputType,
} from "./model";

function toLabelKey(label: string): string {
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
}

class FormFieldService {
    private async getNextIndex(formId: string): Promise<string> {
        const result = await db
            .select({ maxIndex: max(formFieldsTable.orderIndex) })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
        const current = result?.[0]?.maxIndex;
        const next = current ? parseFloat(current) + 1 : 1;

        return next.toFixed(2);
    }
    public async createField(payload: CreateFieldInputType) {
        const { formId, label, description, placeholder, isRequired, type } = await createFieldInput.parseAsync(payload);

        const labelKey = toLabelKey(label);
        const orderIndex = await this.getNextIndex(formId);

        const fieldInsertResult = await db
            .insert(formFieldsTable)
            .values({
                formId,
                label,
                labelKey,
                description,
                placeholder,
                isRequired,
                orderIndex,
                type,
            })
            .returning({
                id: formFieldsTable.id,
            });

        if (!fieldInsertResult || fieldInsertResult.length === 0 || !fieldInsertResult[0]?.id) {
            throw new Error("Failed to create form field");
        }

        return {
            id: fieldInsertResult[0].id,
            labelKey,
            orderIndex
        };
    }
    public async getFormFields(payload: GetFieldsInputType, userId: string) {
        const { formId } = await getFieldsInput.parseAsync(payload);


        const fields = await db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(formFieldsTable.orderIndex);

        return fields;
    }

    public async updateField(payload: UpdateFieldInputType) {
        const { fieldId, ...updates } = await updateFieldInput.parseAsync(payload);

        const patch: Partial<typeof formFieldsTable.$inferInsert> = {};
        if (updates.label !== undefined) patch.label = updates.label;
        if (updates.type !== undefined) patch.type = updates.type;
        if ('description' in updates) patch.description = updates.description ?? null;
        if ('placeholder' in updates) patch.placeholder = updates.placeholder ?? null;
        if (updates.isRequired !== undefined) patch.isRequired = updates.isRequired;

        if (Object.keys(patch).length === 0) throw new Error("No valid fields to update");

        const result = await db
            .update(formFieldsTable)
            .set(patch)
            .where(eq(formFieldsTable.id, fieldId))
            .returning({
                id: formFieldsTable.id,
            });

        if (!result || result.length === 0 || !result[0]?.id) {
            throw new Error("Failed to update form field or field not found");
        }

        return {
            id: result[0].id,
        };
    }

    public async deleteField(payload: DeleteFieldInputType) {
        const { fieldId } = await deleteFieldInput.parseAsync(payload);

        const fieldDeleteResult = await db
            .delete(formFieldsTable)
            .where(eq(formFieldsTable.id, fieldId))
            .returning({
                id: formFieldsTable.id,
            });

        if (!fieldDeleteResult || fieldDeleteResult.length === 0 || !fieldDeleteResult[0]?.id) {
            throw new Error(`Field with id ${fieldId} does not exist`);
        }

        return {
            id: fieldDeleteResult[0].id,
        };
    }

    public async updateFieldOrder(payload: UpdateFieldOrderInputType) {
        const { updates } = await updateFieldOrderInput.parseAsync(payload);

        // Run all updates in a transaction
        await db.transaction(async (tx) => {
            // First pass: set to negative orderIndex to avoid unique constraint violations temporarily
            for (const update of updates) {
                await tx.update(formFieldsTable)
                    .set({ orderIndex: `-${update.orderIndex}` })
                    .where(eq(formFieldsTable.id, update.fieldId));
            }
            // Second pass: set to the correct positive orderIndex
            for (const update of updates) {
                await tx.update(formFieldsTable)
                    .set({ orderIndex: update.orderIndex })
                    .where(eq(formFieldsTable.id, update.fieldId));
            }
        });

        return { success: true };
    }
}

export default FormFieldService;
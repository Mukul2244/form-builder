import { db, eq } from "@repo/database";
import { formSubmissionTable, formsTable } from "@repo/database/schema";
import { 
    submitFormInput, SubmitFormInputType,
    getSubmissionsInput, GetSubmissionsInputType
} from "./model";

class FormSubmissionService {
    public async submitForm(payload: SubmitFormInputType) {
        const { formId, values } = await submitFormInput.parseAsync(payload);

        // Verification of form existence could be done here if needed
        const formResult = await db.select({ id: formsTable.id }).from(formsTable).where(eq(formsTable.id, formId));
        if (!formResult || formResult.length === 0) {
            throw new Error("Form not found");
        }

        const submissionInsertResult = await db
            .insert(formSubmissionTable)
            .values({
                formId,
                values,
            })
            .returning({
                id: formSubmissionTable.id,
            });

        if (!submissionInsertResult || submissionInsertResult.length === 0 || !submissionInsertResult[0]?.id) {
            throw new Error("Failed to create submission");
        }

        return {
            id: submissionInsertResult[0].id,
            success: true,
        }
    }

    public async getSubmissions(payload: GetSubmissionsInputType, userId: string) {
        const { formId } = await getSubmissionsInput.parseAsync(payload);

        // Verify that the user requesting the submissions is the owner of the form
        const form = await db
            .select()
            .from(formsTable)
            .where(eq(formsTable.id, formId));

        if (!form || form.length === 0 || form[0]?.createdBy !== userId) {
            throw new Error("Unauthorized access to form submissions");
        }

        const submissions = await db
            .select()
            .from(formSubmissionTable)
            .where(eq(formSubmissionTable.formId, formId));

        return submissions;
    }
}

export default FormSubmissionService;
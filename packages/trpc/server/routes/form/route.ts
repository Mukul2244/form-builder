import { formService, formFieldService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
    createFormInputModel,
    createFormOutputModel,
    listFormsByUserIdInputModel,
    listFormsByUserIdOutputModel,
    createFieldInputModel,
    createFieldOutputModel,
    getFieldsInputModel,
    getFieldsOutputModel,
    updateFieldInputModel,
    updateFieldOutputModel,
    deleteFieldInputModel,
    deleteFieldOutputModel,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
    //#region create form
    createForm: protectedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createForm"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(createFormInputModel)
        .output(createFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.user.id;

            const { title, description } = input;
            const { id } = await formService.createForm({ createdBy: userId, title, description });

            return { id };
        }),
    //#endregion

    //#region list forms
    listForms: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/listForms"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(listFormsByUserIdInputModel)
        .output(listFormsByUserIdOutputModel)
        .query(async ({ ctx }) => {
            const userId = ctx.user.id;

            const forms = await formService.listFormsByUserId({ userId });
            return forms;
        }),
    //#endregion

    //#region create Field
    createField: protectedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(createFieldInputModel)
        .output(createFieldOutputModel)
        .mutation(async ({ input }) => {
            const { id } = await formFieldService.createField(input);
            return { id };
        }),

    // #endregion
    
    // #region get form fields
    getFields: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getFields"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(getFieldsInputModel)
        .output(getFieldsOutputModel)
        .query(async ({ input, ctx }) => {
            const userId = ctx.user.id;
            const fields = await formFieldService.getFormFields(input, userId);
            
            // map or cast if needed, db select returns the correct type here
            return fields;
        }),
    // #endregion

    // #region update form field
    updateField: protectedProcedure
        .meta({
            openapi: {
                method: "PATCH",
                path: getPath("/updateField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(updateFieldInputModel)
        .output(updateFieldOutputModel)
        .mutation(async ({ input }) => {
            const { id } = await formFieldService.updateField(input);
            return { id };
        }),

    // #endregion

    // #region delete form field
    deleteField: protectedProcedure
        .meta({
            openapi: {
                method: "DELETE",
                path: getPath("/deleteField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(deleteFieldInputModel)
        .output(deleteFieldOutputModel)
        .mutation(async ({ input }) => {
            const { id } = await formFieldService.deleteField(input);
            return { id };
        }),
    // #endregion
});

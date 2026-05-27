import { formService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
    createFormInputModel,
    createFormOutputModel,
    getFormByIdInputModel,
    getFormByIdOutputModel,
    getFormsInputModel,
    getFormsOutputModel,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
    // create form
    createForm: protectedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createForm"),
                tags: TAGS,
                protect : true,
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

    getForms: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getForms"),
                tags: TAGS,
            },
        })
        .input(getFormsInputModel)
        .output(getFormsOutputModel)
        .query(async ({ ctx }) => {
            const userId = ctx.user.id;

            const forms = await formService.getFormsByUserId(userId);
            return forms;
        }),

    getFormById: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getFormById"),
                tags: TAGS,
            },
        })
        .input(getFormByIdInputModel)
        .output(getFormByIdOutputModel)
        .query(async ({ input, ctx }) => {
            const userId = ctx.user.id;

            const form = await formService.getFormById(input.id, userId);
            return form;
        }),
});

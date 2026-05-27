import { formService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
    createFormInputModel,
    createFormOutputModel,
    listFormsByUserIdInputModel,
    listFormsByUserIdOutputModel,
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

    // list forms
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
});

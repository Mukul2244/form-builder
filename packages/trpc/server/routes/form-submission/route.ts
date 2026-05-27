import { formSubmissionService } from "../../services";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
    submitFormInputModel,
    submitFormOutputModel,
    getFormSubmissionsInputModel,
    getFormSubmissionsOutputModel,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formSubmissionRouter = router({
    //#region submit form
    submitForm: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/submitForm"),
                tags: TAGS,
                protect: false,
            },
        })
        .input(submitFormInputModel)
        .output(submitFormOutputModel)
        .mutation(async ({ input }) => {
            const result = await formSubmissionService.submitForm(input);
            return result;
        }),
    //#endregion

    //#region get submissions
    getFormSubmissions: protectedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/getFormSubmissions"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(getFormSubmissionsInputModel)
        .output(getFormSubmissionsOutputModel)
        .query(async ({ input, ctx }) => {
            const userId = ctx.user.id;
            const submissions = await formSubmissionService.getFormSubmissions(input, userId);

            return submissions;
        }),
    //#endregion
});
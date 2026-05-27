import { formSubmissionService } from "../../services";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
    submitFormInputModel,
    submitFormOutputModel,
    getSubmissionsInputModel,
    getSubmissionsOutputModel,
} from "./model";

const TAGS = ["FormSubmission"];
const getPath = generatePath("/form-submission");

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
    getSubmissions: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getSubmissions"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(getSubmissionsInputModel)
        .output(getSubmissionsOutputModel)
        .query(async ({ input, ctx }) => {
            const userId = ctx.user.id;
            const submissions = await formSubmissionService.getSubmissions(input, userId);
            
            return submissions as any;
        }),
    //#endregion
});
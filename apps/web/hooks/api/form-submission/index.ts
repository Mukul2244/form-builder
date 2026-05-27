import { trpc } from "~/trpc/client";

export const useSubmitForm = () => {
    const {
        mutateAsync: submitFormAsync,
        mutate: submitForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending,
    } = trpc.formSubmission.submitForm.useMutation();

    return {
        submitFormAsync,
        submitForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending,
    };
};

export const useGetSubmissions = (formId: string) => {
    const {
        data: submissions,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    } = trpc.formSubmission.getFormSubmissions.useQuery({ formId }, {
        enabled: !!formId,
    });

    return {
        submissions,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};
import { trpc } from "~/trpc/client";

export const useCreateField = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: createFieldAsync,
        mutate: createField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending,
    } = trpc.form.createField.useMutation({
        onSuccess: async (_, variables) => {
            await utils.form.getFields.invalidate({ formId: variables.formId });
        },
    });

    return {
        createFieldAsync,
        createField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending,
    };
};

export const useGetFields = (formId: string) => {
    const {
        data: fields,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    } = trpc.form.getFields.useQuery({ formId });

    return {
        fields,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};

export const useUpdateField = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: updateFieldAsync,
        mutate: updateField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending,
    } = trpc.form.updateField.useMutation({
        onSuccess: async () => {
            await utils.form.getFields.invalidate();
        },
    });

    return {
        updateFieldAsync,
        updateField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending,
    };
};

export const useDeleteField = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: deleteFieldAsync,
        mutate: deleteField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending,
    } = trpc.form.deleteField.useMutation({
        onSuccess: async () => {
            await utils.form.getFields.invalidate();
        },
    });

    return {
        deleteFieldAsync,
        deleteField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending,
    };
};

"use client";

import { use, useState } from "react";
import { useGetPublicFormById } from "~/hooks/api/form";
import { useSubmitForm } from "~/hooks/api/form-submission";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";

interface PageProps {
    params: Promise<{
        form_id: string;
    }>;
}

export default function PublicFormPage({ params }: PageProps) {
    const { form_id } = use(params);
    const { form, isLoading, error } = useGetPublicFormById(form_id);
    const { submitFormAsync, isPending: submitting } = useSubmitForm();
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !form) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <Card className="w-full max-w-xl text-center shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-red-600">Form Not Found</CardTitle>
                        <CardDescription>
                            The form you are looking for does not exist or has been removed.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    // Sort fields by orderIndex just in case
    const sortedFields = [...(form.fields || [])].sort((a, b) => {
        return parseFloat(a.orderIndex || "0") - parseFloat(b.orderIndex || "0");
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const values = sortedFields.map(field => {
            let extractedValue = formData.get(field.id) as string;
            
            // Switch uses 'on' default value natively when checked, otherwise null 
            if (field.type === "YES_NO") {
                extractedValue = formData.get(field.id) === "on" ? "true" : "false";
            }

            return {
                fieldId: field.id,
                value: extractedValue || "",
            }
        });

        try {
            await submitFormAsync({
                formId: form.id,
                values
            });
            setIsSubmitted(true);
            toast.success("Form submitted successfully!");
        } catch (err) {
            toast.error("Failed to submit form. Please try again.");
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 bg-muted/30">
                <Card className="w-full max-w-xl text-center shadow-lg pt-6">
                    <CardHeader>
                        <div className="mx-auto bg-green-100 text-green-600 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <CardTitle className="text-2xl">Thank You!</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Your response has been recorded successfully.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center pb-8">
                        <Button variant="outline" onClick={() => {
                            setIsSubmitted(false);
                            // Optional: Reset form by reloading or explicitly clearing fields here
                        }}>
                            Submit another response
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-muted/30">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl">{form.title}</CardTitle>
                    {form.description && (
                        <CardDescription className="text-base mt-2">
                            {form.description}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {sortedFields.map((field) => (
                            <div key={field.id} className="space-y-2">
                                <Label htmlFor={field.id} className="text-base">
                                    {field.label}
                                    {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                                </Label>
                                {field.description && (
                                    <p className="text-sm text-muted-foreground">{field.description}</p>
                                )}
                                
                                {field.type === "TEXT" && (
                                    <Input
                                        id={field.id}
                                        name={field.id}
                                        placeholder={field.placeholder || ""}
                                        required={field.isRequired}
                                        type="text"
                                    />
                                )}
                                {field.type === "NUMBER" && (
                                    <Input
                                        id={field.id}
                                        name={field.id}
                                        placeholder={field.placeholder || ""}
                                        required={field.isRequired}
                                        type="number"
                                    />
                                )}
                                {field.type === "EMAIL" && (
                                    <Input
                                        id={field.id}
                                        name={field.id}
                                        placeholder={field.placeholder || ""}
                                        required={field.isRequired}
                                        type="email"
                                    />
                                )}
                                {field.type === "PASSWORD" && (
                                    <Input
                                        id={field.id}
                                        name={field.id}
                                        placeholder={field.placeholder || ""}
                                        required={field.isRequired}
                                        type="password"
                                    />
                                )}
                                {field.type === "YES_NO" && (
                                    <div className="flex items-center space-x-2">
                                        <Switch id={field.id} name={field.id} required={field.isRequired} />
                                        <Label htmlFor={field.id}>Yes</Label>
                                    </div>
                                )}
                            </div>
                        ))}

                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
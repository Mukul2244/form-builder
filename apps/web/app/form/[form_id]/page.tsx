"use client";

import { use, useState } from "react";
import { useGetPublicFormById } from "~/hooks/api/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Skeleton } from "~/components/ui/skeleton";

interface PageProps {
    params: Promise<{
        form_id: string;
    }>;
}

export default function PublicFormPage({ params }: PageProps) {
    const { form_id } = use(params);
    const { form, isLoading, error } = useGetPublicFormById(form_id);
    const [submitting, setSubmitting] = useState(false);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for submission logic
        setSubmitting(true);
        setTimeout(() => setSubmitting(false), 1000);
        alert("Form functionality is working UI-wise! (Data Submission Hook next)");
    };

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
                                        name={field.labelKey}
                                        placeholder={field.placeholder || ""}
                                        required={field.isRequired}
                                        type="text"
                                    />
                                )}
                                {field.type === "NUMBER" && (
                                    <Input
                                        id={field.id}
                                        name={field.labelKey}
                                        placeholder={field.placeholder || ""}
                                        required={field.isRequired}
                                        type="number"
                                    />
                                )}
                                {field.type === "EMAIL" && (
                                    <Input
                                        id={field.id}
                                        name={field.labelKey}
                                        placeholder={field.placeholder || ""}
                                        required={field.isRequired}
                                        type="email"
                                    />
                                )}
                                {field.type === "PASSWORD" && (
                                    <Input
                                        id={field.id}
                                        name={field.labelKey}
                                        placeholder={field.placeholder || ""}
                                        required={field.isRequired}
                                        type="password"
                                    />
                                )}
                                {field.type === "YES_NO" && (
                                    <div className="flex items-center space-x-2">
                                        <Switch id={field.id} name={field.labelKey} required={field.isRequired} />
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
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";
import { useGetFormById } from "~/hooks/api/form";
import { FormBuilder } from "./form-builder";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { format } from "date-fns";
import { toast } from "sonner";

export default function EditFormPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  
  const { form, isLoading, error } = useGetFormById(formId);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/form/${formId}`;
      navigator.clipboard.writeText(url);
      toast.success("Public form link copied to clipboard!");
    }
  };

  const handleOpenLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/form/${formId}`;
      window.open(url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <div className="h-10 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-1/3 animate-pulse rounded bg-muted" />
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-1/4 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-32 w-full animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <p className="text-red-500">Failed to load form details.</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/forms")}>
          Go back to forms
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/forms")}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Form: {form.title}</h1>
            {form.createdAt && (
              <p className="text-muted-foreground text-sm">
                Created on {format(new Date(form.createdAt), "PPP")}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/forms/${formId}/submissions`)}>
            View Responses
          </Button>
          <Button variant="outline" onClick={handleCopyLink}>
            <CopyIcon className="mr-2 h-4 w-4" />
            Copy Public Link
          </Button>
          <Button variant="default" onClick={handleOpenLink}>
            <ExternalLinkIcon className="mr-2 h-4 w-4" />
            View Form
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
          <CardDescription>
            {form.description || "No description provided for this form."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Form ID: {form.id}</p>
          </div>
        </CardContent>
      </Card>
      
      <FormBuilder formId={form.id} />
    </div>
  );
}
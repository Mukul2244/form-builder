"use client";

import React, { useMemo } from 'react';
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { format } from "date-fns";
import { useGetFields } from "~/hooks/api/form-field";
import { useGetSubmissions } from "~/hooks/api/form-submission";
import { useGetFormById } from "~/hooks/api/form";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

function FormSubmissions() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const { form, isLoading: formLoading } = useGetFormById(formId);
  const { fields, isLoading: fieldsLoading } = useGetFields(formId);
  const { submissions, isLoading: submissionsLoading } = useGetSubmissions(formId);

  const isLoading = formLoading || fieldsLoading || submissionsLoading;

  // Process the submissions data into a format that's easy to render in the table
  const tableData = useMemo(() => {
    if (!submissions || !fields) return [];

    return submissions.map((submission) => {
      // Create a map of fieldId -> value for easy lookup
      const valuesMap = new Map();
      
      // Handle the fact that submission.values is unknown type from DB
      const submissionValues = Array.isArray(submission.values) ? submission.values : [];
      
      submissionValues.forEach((val: any) => {
        if (val && val.fieldId) {
          valuesMap.set(val.fieldId, val.value);
        }
      });

      return {
        id: submission.id,
        createdAt: submission.createdAt,
        values: valuesMap,
      };
    });
  }, [submissions, fields]);

  // Sort fields by orderIndex for the columns
  const sortedFields = useMemo(() => {
    if (!fields) return [];
    return [...fields].sort((a, b) => (Number(a.orderIndex) || 0) - (Number(b.orderIndex) || 0));
  }, [fields]);

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
          </CardHeader>
          <CardContent>
            <div className="h-32 w-full animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) {
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
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push(`/dashboard/forms/${formId}`)}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Responses: {form.title}</h1>
          <p className="text-muted-foreground text-sm">
            {submissions?.length || 0} response{(submissions?.length !== 1) ? 's' : ''} total
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Responses</CardTitle>
          <CardDescription>
            View and analyze all the data submitted by users for this form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tableData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <p>No submissions yet.</p>
              <p className="text-sm">Share your form public link to start collecting responses.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap font-medium min-w-[150px]">
                      Submitted At
                    </TableHead>
                    {sortedFields.map((field) => (
                      <TableHead key={field.id} className="whitespace-nowrap font-medium min-w-[200px]">
                        {field.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                        {row.createdAt ? format(new Date(row.createdAt), "PP pp") : '-'}
                      </TableCell>
                      {sortedFields.map((field) => (
                        <TableCell key={field.id} className="min-w-[200px]">
                          {row.values.get(field.id) || <span className="text-muted-foreground italic">No value</span>}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default FormSubmissions;
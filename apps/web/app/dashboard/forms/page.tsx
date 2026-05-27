"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { useCreateForm, useGetForms } from "~/hooks/api/form";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(55, "Title must be at most 55 characters"),
  description: z.string().max(300, "Description must be at most 300 characters").optional(),
});

type FormValues = z.infer<typeof formSchema>;

function FormPage() {
  const [open, setOpen] = useState(false);
  const { createFormAsync, isPending } = useCreateForm();
  const { forms, isLoading, error } = useGetForms();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createFormAsync(values);
      toast.success("Form created successfully!");
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to create form");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground">Manage and create your forms.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Form</DialogTitle>
              <DialogDescription>Create a new form to start collecting data.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter form title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter an optional description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted mt-2" />
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter>
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              </CardFooter>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full py-8 text-center text-red-500">Failed to load forms.</div>
        ) : forms?.length === 0 ? (
          <div className="col-span-full py-8 text-center text-muted-foreground">
            No forms found. Create one to get started.
          </div>
        ) : (
          forms?.map((formItem) => (
            <Link key={formItem.id} href={`/dashboard/forms/${formItem.id}`}>
              <Card className="flex flex-col h-full transition-colors hover:bg-muted/50 cursor-pointer">
                <CardHeader>
                  <CardTitle className="truncate">{formItem.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {formItem.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1" />
                <CardFooter className="text-sm text-muted-foreground">
                  {formItem.createdAt ? (
                    <span>Created on {format(new Date(formItem.createdAt), "PPP")}</span>
                  ) : null}
                </CardFooter>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default FormPage;

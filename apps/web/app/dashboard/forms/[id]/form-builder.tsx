"use client";

import React, { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon, GripVerticalIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  useCreateField,
  useGetFields,
  useUpdateField,
  useDeleteField,
  useUpdateFieldOrder,
} from "~/hooks/api/form-field";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

const fieldTypes = ["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"] as const;

const formFieldSchema = z.object({
  label: z.string().min(1, "Label is required").max(100),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  type: z.enum(fieldTypes),
  isRequired: z.boolean(),
});

type FormFieldValues = z.infer<typeof formFieldSchema>;

function SortableRow({ 
  field, 
  handleOpenEdit, 
  handleDelete, 
  isDeleting 
}: { 
  field: any, 
  handleOpenEdit: (f: any) => void, 
  handleDelete: (id: string) => void,
  isDeleting: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-8 px-2 cursor-grab" {...attributes} {...listeners}>
        <GripVerticalIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
      </TableCell>
      <TableCell className="font-medium">{field.label}</TableCell>
      <TableCell>{field.type}</TableCell>
      <TableCell>{field.isRequired ? "Yes" : "No"}</TableCell>
      <TableCell className="text-right space-x-2">
        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(field)}>
          <PencilIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDelete(field.id)} disabled={isDeleting}>
          <TrashIcon className="h-4 w-4 text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function FormBuilder({ formId }: { formId: string }) {
  const { fields, isLoading, error } = useGetFields(formId);
  const { createFieldAsync, isPending: isCreating } = useCreateField();
  const { updateFieldAsync, isPending: isUpdating } = useUpdateField();
  const { deleteFieldAsync, isPending: isDeleting } = useDeleteField();
  const { updateFieldOrderAsync, isPending: isReordering } = useUpdateFieldOrder();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (fields) {
      setItems([...fields].sort((a, b) => parseFloat(a.orderIndex || "0") - parseFloat(b.orderIndex || "0")));
    }
  }, [fields]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      
      const newItemsWithOrder = newItems.map((item, index) => ({
        ...item,
        orderIndex: (index + 1).toFixed(2),
      }));

      setItems(newItemsWithOrder); // Optimistic update

      const updates = newItemsWithOrder.map((item) => ({
        fieldId: item.id,
        orderIndex: item.orderIndex,
      }));

      try {
        await updateFieldOrderAsync({ updates });
        // Don't need toast for every drag, but you could add one here
      } catch (e) {
        toast.error("Failed to save field order");
      }
    }
  };

  const form = useForm<FormFieldValues>({
    resolver: zodResolver(formFieldSchema),
    defaultValues: {
      label: "",
      description: "",
      placeholder: "",
      type: "TEXT",
      isRequired: false,
    },
  });

  const handleOpenCreate = () => {
    setEditingFieldId(null);
    form.reset({
      label: "",
      description: "",
      placeholder: "",
      type: "TEXT",
      isRequired: false,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (field: any) => {
    setEditingFieldId(field.id);
    form.reset({
      label: field.label,
      description: field.description || "",
      placeholder: field.placeholder || "",
      type: field.type as any,
      isRequired: field.isRequired,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (fieldId: string) => {
    if (confirm("Are you sure you want to delete this field?")) {
      try {
        await deleteFieldAsync({ fieldId });
        toast.success("Field deleted");
      } catch (e) {
        toast.error("Failed to delete field");
      }
    }
  };

  const onSubmit = async (values: FormFieldValues) => {
    try {
      if (editingFieldId) {
        await updateFieldAsync({
          fieldId: editingFieldId,
          ...values,
        });
        toast.success("Field updated");
      } else {
        await createFieldAsync({
          formId,
          ...values,
        });
        toast.success("Field created");
      }
      setIsDialogOpen(false);
      form.reset();
    } catch (e) {
      toast.error(editingFieldId ? "Failed to update field" : "Failed to create field");
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Form Fields</CardTitle>
          <CardDescription>Manage the fields for this form.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingFieldId ? "Edit Field" : "Create Field"}</DialogTitle>
              <DialogDescription>
                {editingFieldId ? "Update the properties of this field." : "Add a new field to your form."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. First Name" {...field} />
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
                        <Input placeholder="e.g. Enter your legal first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="placeholder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placeholder</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a field type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fieldTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Required</FormLabel>
                        <CardDescription>Must the user fill out this field?</CardDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-full animate-pulse rounded bg-muted" />
            <div className="h-8 w-full animate-pulse rounded bg-muted" />
          </div>
        ) : error ? (
          <p className="text-red-500">Failed to load fields.</p>
        ) : fields?.length === 0 ? (
          <p className="text-muted-foreground text-sm">No fields added yet.</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={items.map(i => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((field) => (
                    <SortableRow
                      key={field.id}
                      field={field}
                      handleOpenEdit={handleOpenEdit}
                      handleDelete={handleDelete}
                      isDeleting={isDeleting}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}

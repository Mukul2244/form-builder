import {
    pgTable,
    uuid,
    timestamp,
    text,
    json,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export interface FormSubmissionValue {
    fieldId: string;
    value: string;
}

type FormSubmissionValues = FormSubmissionValue[];

export const formSubmissionTable = pgTable("form_submissions", {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid("form_id").notNull().references(() => formsTable.id,{ onDelete: "cascade" }),
    
    values: json("values").$type<FormSubmissionValues>().notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),


});
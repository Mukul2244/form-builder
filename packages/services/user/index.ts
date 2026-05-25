import { randomBytes, createHmac } from "node:crypto";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";

import {
    createUserWithEmailAndPasswordInput,
    generateUserTokenPayload,
    GenerateUserTokenPayloadType,
    type CreateUserWithEmailAndPasswordInputType,
} from "./model";
import * as JWT from "jsonwebtoken";
import { env } from "../env";

class UserService {

    private async getUserByEmail(email: string) {
        const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (!result || result.length === 0) return null;
        return result[0];
    }
    private async generateUserToken(payload: GenerateUserTokenPayloadType) {
        const { id } = await generateUserTokenPayload.parseAsync(payload);
        const token = JWT.sign({ id }, env.JWT_SECRET);
        return { token };

    }
    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
        const { email, fullName, password } = await createUserWithEmailAndPasswordInput.parseAsync(payload);
        const existingUser = await this.getUserByEmail(email);
        if (existingUser) throw new Error(`User with email ${email} already exists`);

        const salt = randomBytes(16).toString("hex");
        const hash = createHmac("sha256", salt).update(password).digest("hex");

        const userInsertResult = await db.insert(usersTable).values({ email, fullName, password: hash, salt, }).returning({
            id: usersTable.id,
        });
        if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) throw new Error("Failed to create user");
        const userId = userInsertResult[0].id;
        const { token } = await this.generateUserToken({ id: userId });
        return {
            id: userId,
            token,
        }
    }
}

export default UserService;
import { UserBaseSchema } from "@/entities/user";
export type UpdateProfilePayload = Pick<UserBaseSchema, "first_name" | "last_name">;

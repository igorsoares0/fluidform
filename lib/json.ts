import type { Prisma } from "@prisma/client";

/** Cast an app object to Prisma's JSON input type for a Json column. */
export function toJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

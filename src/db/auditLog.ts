import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type AuditChange = { from: unknown; to: unknown };
export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

export async function createAuditLog({
  entityType,
  entityId,
  entityLabel,
  action,
  changes,
  performedById,
  performedByName,
  performedByRole,
}: {
  entityType: string;
  entityId: string;
  entityLabel: string;
  action: AuditAction;
  changes?: Record<string, AuditChange>;
  performedById?: string | null;
  performedByName?: string | null;
  performedByRole?: string | null;
}) {
  // Never let a logging failure block the actual mutation it's describing —
  // swallow and warn instead of throwing back into the caller's try/catch.
  try {
    return await prisma.auditLog.create({
      data: {
        entityType,
        entityId,
        entityLabel,
        action,
        changes:
          changes && Object.keys(changes).length
            ? (changes as Prisma.InputJsonValue)
            : undefined,
        performedById: performedById ?? undefined,
        performedByName: performedByName ?? undefined,
        performedByRole: performedByRole ?? undefined,
      },
    });
  } catch (err) {
    console.warn("Failed to write audit log", err);
    return null;
  }
}

// Compares only the given fields between two objects and returns just the
// ones that actually differ — callers pass the pre-update record and the
// incoming values so history entries show a meaningful before/after instead
// of the entire row on every save.
export function diffFields<T extends Record<string, any>>(
  before: T,
  after: Partial<Record<keyof T, any>>,
  fields: (keyof T)[]
): Record<string, AuditChange> {
  const changes: Record<string, AuditChange> = {};
  for (const field of fields) {
    if (!(field in after)) continue;
    const fromVal: any = before[field];
    const toVal: any = after[field];
    const normalizedFrom = fromVal instanceof Date ? fromVal.toISOString() : fromVal ?? null;
    const normalizedTo = toVal instanceof Date ? toVal.toISOString() : toVal ?? null;
    if (normalizedFrom !== normalizedTo) {
      changes[field as string] = { from: normalizedFrom, to: normalizedTo };
    }
  }
  return changes;
}

export async function fetchAuditLogs({
  page = 1,
  pageSize = 20,
  entityType,
}: {
  page?: number;
  pageSize?: number;
  entityType?: string;
}) {
  const where = entityType ? { entityType } : {};
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.auditLog.count({ where }),
  ]);
  return { logs, total, page, pageSize };
}

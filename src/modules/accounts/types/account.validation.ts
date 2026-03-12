import z from "zod";

// Helper to transform date strings to Date objects (optional, but useful)
const dateOrStringToDate = z
  .union([z.date(), z.string().datetime()])
  .transform((val) => (val instanceof Date ? val : new Date(val)));

const dateOrStringToDateNullable = z
  .union([z.date(), z.string().datetime(), z.null()])
  .transform((val) =>
    val === null ? null : val instanceof Date ? val : new Date(val),
  );

export const createAccountSchema = z
  .object({
    userId: z.string().uuid(),
    accountType: z.string().max(20), // adjust max as needed
    levelId: z.number().int(),
    status: z.string().max(20),
    capitalUsd: z.number().min(0),
    balanceUsd: z.number().min(0),
    equityUsd: z.number().min(0),
    drawdownUsd: z.number(),
    totalPnlUsd: z.number(),
    xpPoints: z.number().int().min(0),
    evalStartDate: dateOrStringToDate,
    evalEndDate: dateOrStringToDate,
    fundedAt: dateOrStringToDateNullable.optional(),
    closedAt: dateOrStringToDateNullable.optional(),
    closeReason: z.string().max(255).nullable().optional(),
  })
  .strict();

export const updateAccountSchema = z
  .object({
    accountType: z.string().max(20).optional(),
    levelId: z.number().int().optional(),
    status: z.string().max(20).optional(),
    capitalUsd: z.number().min(0).optional(),
    balanceUsd: z.number().min(0).optional(),
    equityUsd: z.number().min(0).optional(),
    drawdownUsd: z.number().optional(),
    totalPnlUsd: z.number().optional(),
    xpPoints: z.number().int().min(0).optional(),
    evalStartDate: dateOrStringToDate.optional(),
    evalEndDate: dateOrStringToDate.optional(),
    fundedAt: dateOrStringToDateNullable.optional(),
    closedAt: dateOrStringToDateNullable.optional(),
    closeReason: z.string().max(255).nullable().optional(),
  })
  .strict();

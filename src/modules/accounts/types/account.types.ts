import { QueryParams } from "../../../common/types/apiResponse"; // adjust path as needed
// If you have Prisma enums for account_type or status, import them:
// import { $Enums } from "@/generated/prisma/client";

// ----------------------------------------------------------------------
// Full Account entity (response)
// ----------------------------------------------------------------------
export interface AccountResponse {
  id: string; // uuid
  userId: string; // uuid
  accountType: string; // e.g., 'standard', 'premium' – consider using enum
  levelId: number;
  status: string; // e.g., 'active', 'closed' – consider using enum
  capitalUsd: number; // decimal(14,4)
  balanceUsd: number;
  equityUsd: number;
  drawdownUsd: number;
  totalPnlUsd: number;
  xpPoints: number;
  evalStartDate: Date; // date
  evalEndDate: Date; // date
  fundedAt: Date | null;
  closedAt: Date | null;
  closeReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------------------------------------------------------
// Create Account DTO – fields required when creating
// ----------------------------------------------------------------------
export interface CreateAccountDTO {
  userId: string;
  accountType: string;
  levelId: number;
  status: string;
  capitalUsd: number;
  balanceUsd: number;
  equityUsd: number;
  drawdownUsd: number;
  totalPnlUsd: number;
  xpPoints: number;
  evalStartDate: Date | string; // accept string for ISO dates
  evalEndDate: Date | string;
  fundedAt?: Date | string | null;
  closedAt?: Date | string | null;
  closeReason?: string | null;
}

// ----------------------------------------------------------------------
// Update Account DTO – all fields optional
// ----------------------------------------------------------------------
export interface UpdateAccountDTO {
  accountType?: string;
  levelId?: number;
  status?: string;
  capitalUsd?: number;
  balanceUsd?: number;
  equityUsd?: number;
  drawdownUsd?: number;
  totalPnlUsd?: number;
  xpPoints?: number;
  evalStartDate?: Date | string;
  evalEndDate?: Date | string;
  fundedAt?: Date | string | null;
  closedAt?: Date | string | null;
  closeReason?: string | null;
}

// ----------------------------------------------------------------------
// Query DTO for listing/filtering accounts
// ----------------------------------------------------------------------
export interface AccountQueryDto extends QueryParams {
  id?: string;
  userId?: string;
  accountType?: string;
  levelId?: number;
  status?: string;
  capitalUsdMin?: number; // optional range filters
  capitalUsdMax?: number;
  balanceUsdMin?: number;
  balanceUsdMax?: number;
  // ... add other range filters as needed
  xpPointsMin?: number;
  xpPointsMax?: number;
  evalStartDateFrom?: Date | string;
  evalStartDateTo?: Date | string;
  evalEndDateFrom?: Date | string;
  evalEndDateTo?: Date | string;
  fundedAtFrom?: Date | string;
  fundedAtTo?: Date | string;
  closedAtFrom?: Date | string;
  closedAtTo?: Date | string;
  closeReason?: string;
  createdAtFrom?: Date | string;
  createdAtTo?: Date | string;
  updatedAtFrom?: Date | string;
  updatedAtTo?: Date | string;
}

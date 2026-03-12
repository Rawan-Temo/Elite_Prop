import {
  UserCreateInput,
  UserUpdateInput,
} from "@/generated/prisma/internal/prismaNamespaceBrowser";
import { QueryParams } from "../../../common/types/apiResponse";
import { $Enums } from "@/generated/prisma/client";
// TODO seprate each DTOs into own files and class

export interface CreateUserDTO {
  username: string;
  email: string;
  role?: $Enums.Role;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  countryCode?: string | null;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  countryCode?: string;
  phone?: string;
  is_active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface UserQueryDto extends QueryParams {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  countryCode?: string;
  phone?: string;
  is_active?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
export type UpdateUserDTO = {
  username?: string;
  email?: string;
  role?: $Enums.Role;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  countryCode?: string | null;
  isActive?: boolean;
  refreshToken?: string;
};
export interface UserLoginDTO {
  username: string;
  password: string;
}

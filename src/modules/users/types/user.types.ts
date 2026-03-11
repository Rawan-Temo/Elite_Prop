import {
  UserCreateInput,
  UserUpdateInput,
} from "@/generated/prisma/internal/prismaNamespaceBrowser";
import { QueryParams } from "../../../common/types/apiResponse";
// TODO seprate each DTOs into own files and class

export interface CreateUserDTO extends UserCreateInput {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  countryCode?: string;
  phone?: string;

  is_active?: boolean;
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
  id: string;
  username: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
export interface UpdateUserDTO extends UserUpdateInput {
  active?: boolean;
  password?: string;
  refreshToken?: string | null;
}
export interface UserLoginDTO {
  username: string;
  password: string;
}

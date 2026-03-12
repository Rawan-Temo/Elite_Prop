import {
  UserCreateInput,
  UserUpdateInput,
} from "@/generated/prisma/internal/prismaNamespaceBrowser";
import { QueryParams } from "../../../common/types/apiResponse";
import { $Enums } from "@/generated/prisma/client";

// TODO separate each DTO into its own file and class

export class CreateUserDTO {
  username: string = "";
  email: string = "";
  role?: $Enums.Role;
  password: string = "";
  firstName?: string = "";
  lastName?: string = "";
  phone?: string | null;
  countryCode?: string | null;
}

export class UserResponse {
  id!: number; // Using definite assignment assertion (will be set in constructor or by ORM)
  username!: string;
  email!: string;
  role!: string;
  firstName?: string;
  lastName?: string;
  countryCode?: string;
  phone?: string;
  is_active!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  // Optional constructor if you want to populate from a plain object
  constructor(data?: Partial<UserResponse>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class UserQueryDto implements QueryParams {
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

  // If QueryParams has properties, include them here:
  // page?: number;
  // limit?: number;
  // sort?: string;
  // ...
}

export class UpdateUserDTO {
  username?: string;
  email?: string;
  role?: $Enums.Role;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  countryCode?: string | null;
  isActive?: boolean;
  twoFa?: any;
}

export class UserLoginDTO {
  username!: string;
  password!: string;

  constructor(data?: Partial<UserLoginDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

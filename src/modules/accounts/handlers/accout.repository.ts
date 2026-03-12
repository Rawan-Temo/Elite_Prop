import { PrismaAPIFeatures } from "../../../common/utils/apiFeatures";
import { prisma } from "../../../prisma/client";
import {
  CreateAccountDTO,
  UpdateAccountDTO,
  AccountQueryDto,
  AccountResponse,
} from "../types/account.types";
export const accountRepository = {
  getAll: async (query: AccountQueryDto) => {
    const features = new PrismaAPIFeatures("account", query, {})
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const rows = await features.findMany();

    const count = await features.count();

    return { rows, count };
  },
  create: (data: CreateAccountDTO) =>
    prisma.account.create({
      data,
    }),
  getById: (id: any) =>
    prisma.account.findUnique({
      where: {
        id,
      },
    }),
  update: (data: UpdateAccountDTO, id: any) =>
    prisma.account.update({
      where: {
        id,
      },
      data,
    }),
  deleteMany: (ids: any[]) =>
    prisma.user.deleteMany({
      where: {
        id: { in: ids },
      },
    }),
  findByUsername: (username: string) =>
    prisma.user.findUnique({
      where: {
        username,
      },
    }),
};

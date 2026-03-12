import { AccountQueryDto } from "../types/account.types";
import { accountRepository } from "./accout.repository";

export const accountService = {
  getAllAccounts: async (query: AccountQueryDto) => {
    return await accountRepository.getAll(query);
  },
  getOneAccount: async (id: any) => {
    return await accountRepository.getById(id);
  },

  createAccount: async (data: any) => {
    return await accountRepository.create(data);
  },
  updateAccount: async (data: any, id: any) => {
    return await accountRepository.update(data, id);
  },
  deleteManyAccounts: (ids: any[]) => {
    return accountRepository.deleteMany(ids);
  },
};

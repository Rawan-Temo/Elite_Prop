import { type Request, type Response } from "express";

const getAllAccounts = async (req: Request, res: Response) => {
  res.send("get all accounts");
};
const createAccount = async (req: Request, res: Response) => {
  res.send("createAccount all accounts");
};
const deleteManyAccounts = async (req: Request, res: Response) => {
  res.send("deleteManyAccounts all accounts");
};
const getOneAccount = async (req: Request, res: Response) => {
  res.send("getOneAccount all accounts");
};
const updateAccount = async (req: Request, res: Response) => {
  res.send("updateAccount");
};
export {
  getAllAccounts,
  createAccount,
  deleteManyAccounts,
  getOneAccount,
  updateAccount,
};

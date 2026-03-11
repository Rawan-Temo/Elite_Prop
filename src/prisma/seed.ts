import { UserCreateInput } from "@/generated/prisma/models";
import { prisma } from "./client";
import { hashingPassword } from "@/common/utils/helpers";

/*
  email        String   @unique @db.VarChar(255)
  password String   @map("password_hash") @db.VarChar(255)
  firstName    String   @map("first_name") @db.VarChar(100)
  lastName     String   @map("last_name") @db.VarChar(100)
  phone        String?  @db.VarChar(30)
  countryCode  String?  @map("country_code") @db.Char(2)
*/
const DEFAULT_USER: UserCreateInput = {
  email: "6H8oR@example.com",
  password: "test",
  firstName: "John",
  username: "admin",
  role: "admin",

  lastName: "Doe",
  phone: "+1234567890",
  countryCode: "US",
};

async function main() {
  const HASH_PASSWORD = await hashingPassword("admin123");
  console.log("Seeding database...");
  DEFAULT_USER.password = HASH_PASSWORD;
  prisma.user
    .upsert({
      where: { email: DEFAULT_USER.email },
      update: {},
      create: DEFAULT_USER,
    })
    .then(() => {
      console.log("Database seeded successfully.");
    })
    .catch((error) => {
      console.error("Error seeding database:", error);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}

main();

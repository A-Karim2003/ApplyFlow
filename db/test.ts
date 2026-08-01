import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { usersTable } from "./schema";

async function main() {
  // Create
  const newUser: typeof usersTable.$inferInsert = {
    name: "John",
    age: 30,
    email: "john@example.com",
  };
  await db.insert(usersTable).values(newUser);
  console.log("Inserted:", newUser);

  // Read
  const all = await db.select().from(usersTable);
  console.log("All rows:", all);

  // Update
  await db
    .update(usersTable)
    .set({ age: 31 })
    .where(eq(usersTable.email, newUser.email));
  console.log("Updated user with email:", newUser.email);

  const updated = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, newUser.email));
  console.log("After update:", updated);

  // // Delete
  // await db.delete(usersTable).where(eq(usersTable.email, newUser.email));
  // console.log("Deleted user with email:", newUser.email);

  // const afterDelete = await db
  //   .select()
  //   .from(usersTable)
  //   .where(eq(usersTable.email, newUser.email));
  // console.log("After delete (should be empty):", afterDelete);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

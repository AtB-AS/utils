import { z } from "zod";

console.log("Hello World");

export const Person = z.object({
  name: z.string(),
});
export type Person = z.infer<typeof Person>;

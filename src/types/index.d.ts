// The types we are defining here, we can use them in all of our projects.
// As we can not do "throw new error" on server components to Show error on the client side.
// We have defined types here so that we can use these type on the Server Action to tell about errors on the client side.
// This will give us the structure for error handling on our server Actions.
import { ZodIssue } from "zod";

type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string | ZodIssue[] };

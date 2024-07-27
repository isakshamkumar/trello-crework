import { ZodError } from "zod";

const getZodErrorMessage = (error: ZodError) => {
  return error.issues.map((issue) => ({
    path: issue.path[0],
    message: issue.message,
  }));
};
export default getZodErrorMessage;

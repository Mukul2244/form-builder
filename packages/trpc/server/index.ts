import { router } from "./trpc";

import { authRouter } from "./routes/auth/route";
import { formRouter } from "./routes/form/route";
import { formSubmissionRouter } from "./routes/form-submission/route";

export const serverRouter = router({
  auth: authRouter,
  form: formRouter,
  formSubmission: formSubmissionRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;

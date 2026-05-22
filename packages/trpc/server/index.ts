import { publicProcedure, router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import z from "zod";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  test: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .output(z.object({ message: z.string() }))
    .query(({ input }) => {
      return { message: `Hello, ${input.email}!` };
    }),
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;

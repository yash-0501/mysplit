import { z } from "zod";

const userSchema = z
  .object({
    name: z.string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
      description: "User ID",
    }),
    email: z
      .string({
        required_error: "Email is required.",
        invalid_type_error: "Invalid Email Entered.",
      })
      .email(),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .superRefine((data, ctx) => {
        isValidPass(data, ctx);
      }),
    confirm: z.string({
      required_error: "confirm Password is required",
      invalid_type_error: "confirm Password must be a string",
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

const addCtxIssue = (ctx: z.RefinementCtx, message: string): void => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: message,
  });
};

const isValidPass = (value: string, ctx: z.RefinementCtx): void => {
  const lowercaseRegex = /[a-z]/;
  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /\d/;
  const specialCharRegex = /[!@#$%^&*]/;

  if (!lowercaseRegex.test(value)) {
    addCtxIssue(ctx, "Password must have at least one lowercase letter");
  }
  if (!uppercaseRegex.test(value)) {
    addCtxIssue(ctx, "Password must have at least one uppercase letter");
  }
  if (!numberRegex.test(value)) {
    addCtxIssue(ctx, "Password must have at least one number");
  }
  if (!specialCharRegex.test(value)) {
    addCtxIssue(
      ctx,
      "Password must have at least one special character (!@#$%^&*)"
    );
  }
  if (value.length < 8) {
    addCtxIssue(ctx, "Password length must be at least 8 characters");
  }
};

type UserType = z.infer<typeof userSchema>;

export { UserType, userSchema };

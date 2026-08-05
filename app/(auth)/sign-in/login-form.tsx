"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import GoogleIcon from "../_components/google-icon";

const FormSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Must be at least 8 characters"),
  remember: z.boolean(),
});

type FormValues = z.infer<typeof FormSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    // Call your login action here
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-sm flex-col"
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Welcome back!
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Log in to continue your job search
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter email"
            aria-invalid={!!errors.email}
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter password"
              className="pr-10"
              aria-invalid={!!errors.password}
              disabled={isSubmitting}
              {...register("password")}
            />

            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground hover:bg-transparent focus-visible:outline-none focus-visible:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>

          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </Field>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="remember"
              render={({ field }) => (
                <Checkbox
                  id="remember"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />

            <FieldLabel
              htmlFor="remember"
              className="text-sm font-normal text-muted-foreground"
            >
              Remember me
            </FieldLabel>
          </div>

          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary underline underline-offset-4 hover:no-underline"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full text-sm font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </div>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-11 w-full gap-2.5 text-sm font-medium"
      >
        <GoogleIcon />
        Log in with Google
      </Button>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-primary underline underline-offset-4 hover:no-underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}

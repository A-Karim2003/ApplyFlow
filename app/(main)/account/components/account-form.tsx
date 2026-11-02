"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { updateProfile } from "@/actions/profiles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SpinnerEllipsis from "@/components/shadcn-space/spinner/spinner-05";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/profile";

type AccountFormProps = UpdateProfileInput & {
  email: string;
  image?: string | null;
  initials: string;
};

export function AccountForm({
  firstName,
  lastName,
  bio,
  email,
  image,
  initials,
}: AccountFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { firstName, lastName, bio },
  });

  async function submit(values: UpdateProfileInput) {
    const result = await updateProfile(values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    reset(values);
    toast.success("Profile updated");
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-2xl">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Your name and a short bio.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-4 border-b pb-6">
            <Avatar className="size-16">
              {image && <AvatarImage src={image} alt="" />}
              <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">
              Taken from your Google account when you sign in with Google,
              otherwise your initials are shown.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                aria-invalid={!!errors.firstName}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                aria-invalid={!!errors.lastName}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} readOnly disabled />
            <p className="text-xs text-muted-foreground">
              Your email can&apos;t be changed.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="A short line about you and the roles you're targeting."
              className="min-h-24 resize-y"
              aria-invalid={!!errors.bio}
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={!isDirty || isSubmitting}
            onClick={() => reset()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            Save changes
            {isSubmitting && <SpinnerEllipsis />}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

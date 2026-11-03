"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  removeProfileImage,
  updateProfile,
  updateProfileImage,
} from "@/actions/profiles";
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
  AVATAR_TYPES,
  avatarUploadSchema,
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/profile";
import { createAvatarUploadUrl } from "@/lib/s3/avatar/presigned-avatar-upload";

type AccountFormProps = UpdateProfileInput & {
  email: string;
  image?: string | null;
  initials: string;
  hasUpload: boolean;
};

export function AccountForm({
  firstName,
  lastName,
  bio,
  email,
  image,
  initials,
  hasUpload,
}: AccountFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  //* Function for handling avatar uploads into S3 and storing key in DB
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    //? client pre-check for UX only; the server re-validates
    const check = avatarUploadSchema.safeParse({
      contentType: file.type,
      size: file.size,
    });

    if (!check.success) {
      toast.error("Use a JPG, PNG or WebP image under 2MB.");
      return;
    }

    setIsUploading(true);
    try {
      const upload = await createAvatarUploadUrl({
        contentType: file.type,
        size: file.size,
      });

      if (!upload.success) {
        toast.error(upload.error);
        return;
      }

      //? Content-Type must match what was signed, or S3 returns 403
      const put = await fetch(upload.data.presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!put.ok) {
        toast.error("Upload failed");
        return;
      }

      const saved = await updateProfileImage(upload.data.key);
      if (!saved.success) {
        toast.error(saved.error);
        return;
      }
      toast.success("Photo updated");
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  //* Function for handling avatar deletion in S3 and removing key in DB

  async function handleRemove() {
    setIsUploading(true);
    try {
      const result = await removeProfileImage();
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Photo removed");
    } catch {
      toast.error("Could not remove photo");
    } finally {
      setIsUploading(false);
    }
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
              {image && (
                <AvatarImage src={image} alt="" referrerPolicy="no-referrer" />
              )}
              <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? "Working…" : "Change photo"}
                </Button>

                {/* has upload means an image key already exists in db */}
                {hasUpload && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isUploading}
                    onClick={handleRemove}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or WebP, up to 2MB.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={AVATAR_TYPES.join(",")}
              className="hidden"
              onChange={handleFile}
            />
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

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { set } from "date-fns";
import { Clock2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  INTERVIEW_OUTCOME_OPTIONS,
  INTERVIEW_TYPE_OPTIONS,
} from "@/lib/constants";

import { DialogFooter } from "@/components/ui/dialog";
import {
  scheduleInterviewSchema,
  ScheduleInterviewValues,
} from "@/lib/validations/interview";
import { createInterview } from "@/actions/interviews";
import { toast } from "react-toastify";

export default function ScheduleInterviewForm({
  applicationId,
  onClose,
}: {
  applicationId: number;
  onClose: () => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ScheduleInterviewValues>({
    resolver: zodResolver(scheduleInterviewSchema),
    defaultValues: {
      date: undefined,
      time: "",
      interviewType: "online_assessment",
      outcome: "pending",
      interviewerName: "",
      notes: "",
    },
  });

  async function submit(values: ScheduleInterviewValues) {
    const [hours, minutes] = values.time.split(":").map(Number);

    const result = await createInterview({
      applicationId,
      scheduledAt: set(values.date, {
        hours,
        minutes,
        seconds: 0,
        milliseconds: 0,
      }),
      interviewType: values.interviewType,
      outcome: values.outcome,
      interviewerName: values.interviewerName || null,
      notes: values.notes || null,
    });

    //* Stay open on failure so nothing typed is lost
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Interview scheduled");
    onClose();
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="grid gap-6 md:grid-cols-[1fr_2fr] sm:grid-cols-[1fr_1fr]"
    >
      {/*=======Date and time=======*/}
      <Card size="sm" className="min-w-62.5">
        <CardContent>
          <Controller
            name="date"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  weekStartsOn={1}
                  className="p-0"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </CardContent>
        <CardFooter className="border-t bg-card">
          <Controller
            name="time"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-full">
                <FieldLabel htmlFor="interview-time">Time</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="interview-time"
                    type="time"
                    className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <InputGroupAddon>
                    <Clock2Icon className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </CardFooter>
      </Card>

      {/*=======Details=======*/}
      <FieldGroup>
        <Controller
          name="interviewType"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>
                Interview type <span className="text-destructive">*</span>
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {
                      INTERVIEW_TYPE_OPTIONS.find(
                        (option) => option.value === field.value,
                      )?.label
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {INTERVIEW_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Field>
          <FieldLabel htmlFor="interviewer-name">
            Interviewer (optional)
          </FieldLabel>
          <Input id="interviewer-name" {...register("interviewerName")} />
        </Field>

        <Controller
          name="outcome"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Outcome</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {
                      INTERVIEW_OUTCOME_OPTIONS.find(
                        (option) => option.value === field.value,
                      )?.label
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {INTERVIEW_OUTCOME_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Field>
          <FieldLabel htmlFor="interview-notes">Notes (optional)</FieldLabel>
          <Textarea id="interview-notes" {...register("notes")} />
        </Field>
      </FieldGroup>

      <DialogFooter className="sm:col-span-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Skip
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Save interview
        </Button>
      </DialogFooter>
    </form>
  );
}

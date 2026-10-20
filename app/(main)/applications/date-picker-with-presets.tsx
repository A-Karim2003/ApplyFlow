"use client";

import { useState } from "react";
import { addDays, addMonths, format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerWithPresetsProps = {
  value?: string;
  onChange: (value: string) => void;
  id?: string;
};

const PRESETS = [
  { label: "In 1 week", getDate: () => addDays(new Date(), 7) },
  { label: "In 2 weeks", getDate: () => addDays(new Date(), 14) },
  { label: "In 1 month", getDate: () => addMonths(new Date(), 1) },
];

export function DatePickerWithPresets({
  value,
  onChange,
  id,
}: DatePickerWithPresetsProps) {
  const selected = value ? parseISO(value) : undefined;
  const [month, setMonth] = useState<Date>(selected ?? new Date());
  const [open, setOpen] = useState(false);

  function select(date: Date | undefined) {
    onChange(date ? format(date, "yyyy-MM-dd") : "");
    if (date) setMonth(date);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start font-normal",
              !selected && "text-muted-foreground",
            )}
          >
            <CalendarIcon />
            {selected ? format(selected, "PP") : "Pick a date"}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Card className="w-fit border-0 shadow-none" size="sm">
          <CardContent className="p-0">
            <Calendar
              id={id}
              mode="single"
              selected={selected}
              onSelect={select}
              month={month}
              onMonthChange={setMonth}
              fixedWeeks
              className="p-0 [--cell-size:--spacing(9.5)]"
            />
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 border-t p-3">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => select(preset.getDate())}
              >
                {preset.label}
              </Button>
            ))}
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

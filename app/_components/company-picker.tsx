"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Plus } from "lucide-react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CompanyValue } from "./add-application-form";
import type { Company } from "@/lib/data/companies";

type CompanyOption = { id: number; label: string };

type CompanyPickerProps = {
  value: CompanyValue | undefined;
  onChange: (value: CompanyValue | undefined) => void;
  companies: Company[];
  invalid: boolean;
};

const API_KEY = process.env.COMPANIES_HOUSE_API_KEY;
// if (!API_KEY) throw new Error("Companies House API key is missing");

//? The form (via Controller) owns the selected company. This component only owns UI-only state:
//? the combobox text, whether the inline add input is open, and its draft name.
//? Mode is derived: value.type === "new" -> confirmed, isAdding -> inline add, otherwise -> combobox.
export default function CompanyPicker({
  value,
  onChange,
  companies,
  invalid,
}: CompanyPickerProps) {
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  //? Memoised so item references stay stable between renders
  const options = useMemo<CompanyOption[]>(
    () => companies.map((c) => ({ id: c.id, label: c.name })),
    [companies],
  );

  function startAdding() {
    //? Prefill with whatever the user had typed in the combobox
    setNewName(query.trim());
    setIsAdding(true);
  }

  function confirmNew() {
    const name = newName.trim();
    if (!name) return;
    onChange({ type: "new", name });
    setIsAdding(false);
    setQuery("");
  }

  function backToPicking() {
    setIsAdding(false);
    setNewName("");
  }

  function changeCompany() {
    onChange(undefined);
    setNewName("");
    setQuery("");
  }

  async function searchCompanies(query: string) {
    // TODO: Implement Companies House API search

    if (query.length < 2) return [];

    const params = new URLSearchParams({
      q: query,
      items_per_page: "5",
    });

    const res = await fetch(
      `https://api.company-information.service.gov.uk/search/companies?${params}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}`,
        },
      },
    );

    const data = await res.json();
    console.log(data);
  }

  //* Mode 3: a new company has been confirmed
  if (value?.type === "new") {
    return (
      <div className="flex items-center gap-2">
        <Input id="company" value={value.name} readOnly className="flex-1" />
        <Button type="button" variant="outline" onClick={changeCompany}>
          Change
        </Button>
      </div>
    );
  }

  //* Mode 2: inline add - add company using Companies House api (Companies House search will slot in here later)
  if (isAdding) {
    return (
      <div className="flex flex-col gap-2">
        <Input
          id="company"
          autoFocus
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            //? Stop Enter from submitting the whole application form
            if (e.key === "Enter") {
              e.preventDefault();
              confirmNew();
            }
          }}
          placeholder="Company name"
        />
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={backToPicking}
          >
            <ArrowLeft data-icon="inline-start" /> Back
          </Button>
          {/* This button is a fallback for a company that is in neither database nor Companies House */}
          <Button
            type="button"
            size="sm"
            disabled={!newName.trim()}
            onClick={confirmNew}
          >
            Use this company
          </Button>
        </div>
      </div>
    );
  }

  //* Mode 1: default mode - pick from existing companies (max 5), last row is always "Add company"
  const selectedId = value?.type === "existing" ? value.id : undefined;
  const selected = options.find((option) => option.id === selectedId) ?? null;

  return (
    <Combobox
      items={options}
      value={selected}
      onValueChange={(option) =>
        onChange(option ? { type: "existing", id: option.id } : undefined)
      }
      inputValue={query}
      onInputValueChange={setQuery}
      limit={5}
    >
      <ComboboxInput
        id="company"
        placeholder="Search or select a company"
        aria-invalid={invalid}
      />
      <ComboboxContent>
        <ComboboxEmpty>No matching companies.</ComboboxEmpty>
        <ComboboxList>
          {(item: CompanyOption) => (
            <ComboboxItem key={item.id} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>

        <div className="border-t p-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={startAdding}
          >
            <Plus data-icon="inline-start" />
            {query.trim() ? `Add "${query.trim()}"` : "Add company"}
          </Button>
        </div>
      </ComboboxContent>
    </Combobox>
  );
}

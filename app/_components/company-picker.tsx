"use client";

import { useState, useMemo, useEffect } from "react";
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

import type { CompanyValue } from "@/lib/validations/applications";
import type { Company } from "@/lib/data/companies";
import type { Result, SearchResult } from "@/types";

type CompanyOption = { id: number; label: string };

type CompanyPickerProps = {
  value: CompanyValue | undefined;
  onChange: (value: CompanyValue | undefined) => void;
  companies: Company[];
  invalid: boolean;
};

const MIN_SEARCH_LENGTH = 2;

export default function CompanyPicker({
  value,
  onChange,
  companies,
  invalid,
}: CompanyPickerProps) {
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchFailed, setSearchFailed] = useState(false);

  const searchTerm = newName.trim();

  //? Memoised so item references stay stable between renders
  const options = useMemo<CompanyOption[]>(
    () => companies.map((c) => ({ id: c.id, label: c.name })),
    [companies],
  );

  //? Search 300ms after the user stops typing. The cleanup cancels the previous timer on every change.
  useEffect(() => {
    if (!isAdding || searchTerm.length < MIN_SEARCH_LENGTH) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/companies/search?q=${encodeURIComponent(searchTerm)}`,
        );
        const body: Result<SearchResult[]> = await res.json();

        if (body.success) {
          setSearchFailed(false);
          setResults(body.data);
        } else {
          setSearchFailed(true);
        }
      } catch {
        setSearchFailed(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isAdding, searchTerm]);

  function startAdding() {
    //? Prefill with whatever the user had typed in the combobox
    setNewName(query.trim());
    setIsAdding(true);
  }

  //? Used for "Use this company" (name only) and for a clicked Companies House result
  function confirmNew(name: string, companyHouseNumber?: string) {
    const companyName = name.trim();
    if (!companyName) return;
    onChange({ type: "new", name: companyName, companyHouseNumber });
    setIsAdding(false);
    setQuery("");
    setResults([]);
  }

  function backToPicking() {
    setIsAdding(false);
    setSearchFailed(false);
    setNewName("");
    setResults([]);
  }

  function changeCompany() {
    onChange(undefined);
    setNewName("");
    setQuery("");
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

  //* Mode 2: inline add with Companies House results
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
              confirmNew(newName);
            }
          }}
          placeholder="Company name"
        />

        {searchFailed && searchTerm.length >= MIN_SEARCH_LENGTH && (
          <p className="text-sm text-muted-foreground">
            Company search is unavailable. You can still use the name as typed.
          </p>
        )}

        {/* Results from the last search; hidden when the input is too short */}
        {searchTerm.length >= MIN_SEARCH_LENGTH && results.length > 0 && (
          <ul className="rounded-md border text-sm">
            {results.map((result) => (
              <li key={result.companyNumber}>
                <button
                  type="button"
                  className="w-full px-2 py-1.5 text-left hover:bg-muted"
                  onClick={() => confirmNew(result.name, result.companyNumber)}
                >
                  <span className="block font-medium">{result.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={backToPicking}
          >
            <ArrowLeft data-icon="inline-start" /> Back
          </Button>
          {/* Fallback for a company that is in neither database nor Companies House */}
          <Button
            type="button"
            size="sm"
            disabled={!newName.trim()}
            onClick={() => confirmNew(newName)}
          >
            Use this company
          </Button>
        </div>
      </div>
    );
  }

  //* Mode 1: pick from existing companies (max 5), last row is always "Add company"
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

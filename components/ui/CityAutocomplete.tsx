"use client";

import { useState } from "react";
import { searchCities, CityMatch } from "@/lib/city-timezone";

export function CityAutocomplete({
  value,
  onSelect,
  inputClassName,
  placeholder = "City, State/Country",
}: {
  value: string;
  onSelect: (label: string, match: CityMatch | null) => void;
  inputClassName: string;
  placeholder?: string;
}) {
  const [suggestions, setSuggestions] = useState<CityMatch[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  function handleChange(text: string) {
    // Typing freely invalidates any previously resolved city match, until
    // the person picks a suggestion again.
    onSelect(text, null);
    try {
      setSuggestions(searchCities(text));
    } catch {
      // Never let a lookup failure break typing in the input itself.
      setSuggestions([]);
    }
    setIsOpen(true);
  }

  function handlePick(match: CityMatch) {
    onSelect(match.label, match);
    setSuggestions([]);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsOpen(suggestions.length > 0)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder}
        className={inputClassName}
        autoComplete="off"
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-xl2 border border-line bg-bg-surface shadow-lg">
          {suggestions.map((s, i) => (
            <li key={`${s.label}-${i}`}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handlePick(s)}
                className="block w-full px-4 py-2 text-left text-sm text-ink hover:bg-bg-raised"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

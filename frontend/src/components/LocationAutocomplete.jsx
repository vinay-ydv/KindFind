import React, { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import axios from "axios";

export function LocationAutocomplete({ value, onChange }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const wrapperRef = useRef(null);

  // Keep local query in sync if the parent clears the form
  useEffect(() => {
    if (value === "") {
      setQuery("");
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // FIX 1: If they click outside without selecting a valid option, 
        // revert the text box back to the last officially saved value.
        // We use a functional state update to ensure we have the latest 'value' prop
        setQuery((currentQuery) => {
           // If they didn't pick anything, clear their gibberish
           return value || "";
        });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]); // Added value to dependency array so it knows the latest valid state

  // The Debounced API Call
  useEffect(() => {
    // Don't search if empty or if the query matches the officially selected value
    if (!query.trim() || query === value) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&accept-language=en&limit=5`
        );
        setSuggestions(response.data);
        if (response.data.length > 0) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setIsLoading(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [query, value]); // Added value here too

  const handleSelect = (suggestion) => {
    const locationName = suggestion.display_name;
    setQuery(locationName); // Update the visual input
    
    // FIX 2: THIS is the ONLY place we update the parent component now!
    onChange(locationName); 
    
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          required
          placeholder="Search for a precise location..."
          value={query}
          onChange={(e) => {
            // FIX 3: Only update the local visual state while typing.
            // Do NOT call onChange(e.target.value) here anymore.
            setQuery(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500 animate-spin" />
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.place_id}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0 transition-colors text-left"
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
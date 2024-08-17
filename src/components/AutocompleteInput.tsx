import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Feature {
  id: string;
  place_name: string;
  center: [number, number];
}

interface LocationAddress {
  address: string;
  coordinates: [number, number];
}

interface AutocompleteInputProps {
  placeholder: string;
  value: string;
  onChange: (value: LocationAddress) => void;
  className?: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  placeholder,
  value,
  onChange,
  className = "",
}) => {
  const [suggestions, setSuggestions] = useState<Feature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    setInputValue(value);
    setIsLocationSelected(!!value);
  }, [value]);

  useEffect(() => {
    if (isLocationSelected) return;

    const fetchSuggestions = async () => {
      if (inputValue.length > 0) {
        setIsLoading(true);
        const features = await fetchMapboxSuggestions(inputValue);
        setSuggestions(features);
        setShowSuggestions(true);
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [inputValue, isLocationSelected]);

  const fetchMapboxSuggestions = async (query: string): Promise<Feature[]> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=place,locality,neighborhood`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.features;
    } catch (error) {
      console.error("Error fetching Mapbox suggestions:", error);
      return [];
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setFocusedIndex(-1);
    setIsLocationSelected(false);
  };

  const handleSelectLocation = (feature: Feature) => {
    const location: LocationAddress = {
      address: feature.place_name,
      coordinates: feature.center,
    };
    onChange(location);
    setShowSuggestions(false);
    setInputValue(feature.place_name);
    setIsLocationSelected(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      handleSelectLocation(suggestions[focusedIndex]);
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && suggestionsRef.current) {
      const focusedElement = suggestionsRef.current.children[
        focusedIndex
      ] as HTMLElement;
      focusedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focusedIndex]);

  return (
    <div className="relative">
      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (!isLocationSelected) setShowSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onKeyDown={handleKeyDown}
        className={`w-full p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F96167] transition duration-300 ${className}`}
        required
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#F96167]"></div>
        </div>
      )}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && !isLocationSelected && (
          <motion.ul
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((feature, index) => (
              <motion.li
                key={feature.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-2 hover:bg-gray-100 cursor-pointer transition duration-300 ${
                  focusedIndex === index ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSelectLocation(feature)}
              >
                <div className="font-semibold flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-[#F96167]" />
                  {feature.place_name}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutocompleteInput;

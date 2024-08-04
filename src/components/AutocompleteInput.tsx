import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Location {
  coordinates: [number, number];
  city: string;
  region: string;
  locationId: string;
}

interface AutocompleteInputProps {
  placeholder: string;
  value: string;
  onChange: (value: Location & { address: string }) => void;
  className?: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  placeholder,
  value,
  onChange,
  className = "",
}) => {
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length > 0) {
        setIsLoading(true);
        const locations = await fetchLocations(inputValue);
        setSuggestions(locations);
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
  }, [inputValue]);

  const fetchLocations = async (prefix: string): Promise<Location[]> => {
    try {
      const response = await fetch(`/api/cities?namePrefix=${prefix}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data.map((city: any) => ({
        coordinates: [city.latitude, city.longitude],
        city: city.name,
        region: city.region,
        locationId: city.id,
      }));
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setFocusedIndex(-1);
  };

  const handleSelectLocation = (location: Location) => {
    onChange({
      ...location,
      address: `${location.city}, ${location.region}`,
    });
    setShowSuggestions(false);
    setInputValue(`${location.city}, ${location.region}`);
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
        onFocus={() => setShowSuggestions(true)}
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
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((location, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-2 hover:bg-gray-100 cursor-pointer transition duration-300 ${
                  focusedIndex === index ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSelectLocation(location)}
              >
                <div className="font-semibold flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-[#F96167]" />
                  {location.city}
                </div>
                <div className="text-sm text-gray-500 ml-6">
                  {location.region}
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

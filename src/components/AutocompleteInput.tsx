import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

interface City {
  name: string;
  region: string;
}

interface AutocompleteInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length > 0) {
        setIsLoading(true);
        const cities = await fetchCities(value);
        setSuggestions(cities);
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
  }, [value]);

  const fetchCities = async (prefix: string): Promise<City[]> => {
    try {
      const response = await fetch(
        `http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${prefix}&limit=5&offset=0&countryIds=IN`
      );
      const data = await response.json();
      return data.data.map((city: any) => ({
        name: city.name,
        region: city.region,
      }));
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  };

  return (
    <div className="relative">
      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className="w-full p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F96167] transition duration-300"
        required
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#F96167]"></div>
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((city, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer transition duration-300"
              onClick={() => {
                onChange(city.name);
                setShowSuggestions(false);
              }}
            >
              <div className="font-semibold">{city.name}</div>
              <div className="text-sm text-gray-500">{city.region}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;

import React, { createContext, useContext, useState, type ReactNode } from "react";

interface FilterContextType {
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  dateRange: { start: string; end: string };
  updateDateRange: (range: { start: string; end: string }) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const updateDateRange = (range: { start: string; end: string }) => setDateRange(range);

  return (
    <FilterContext.Provider
      value={{
        selectedCategories,
        toggleCategory,
        dateRange,
        updateDateRange,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
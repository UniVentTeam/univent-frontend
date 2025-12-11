import React, { createContext, useContext, useState, type ReactNode } from "react";

interface FilterContextType {
  // Categories / Event Types
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  matchAll: boolean;
  setMatchAll: (value: boolean) => void;
  
  // Date
  dateRange: { start: string; end: string };
  updateDateRange: (range: { start: string; end: string }) => void;

  // New Filters
  selectedAssociations: string[];
  setSelectedAssociations: (associations: string[]) => void;
  selectedFaculties: string[];
  setSelectedFaculties: (faculties: string[]) => void;
  selectedDepartments: string[];
  setSelectedDepartments: (departments: string[]) => void;
  selectedOrganizerTypes: string[];
  setSelectedOrganizerTypes: (organizers: string[]) => void;
  selectedLocationTypes: string[];
  setSelectedLocationTypes: (locations: string[]) => void;
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
  // Categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [matchAll, setMatchAll] = useState(false);
  
  // Date
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const updateDateRange = (range: { start: string; end: string }) => setDateRange(range);

  // New Filters
  const [selectedAssociations, setSelectedAssociations] = useState<string[]>([]);
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedOrganizerTypes, setSelectedOrganizerTypes] = useState<string[]>([]);
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>([]);

  return (
    <FilterContext.Provider
      value={{
        selectedCategories,
        setSelectedCategories,
        matchAll,
        setMatchAll,
        dateRange,
        updateDateRange,
        selectedAssociations,
        setSelectedAssociations,
        selectedFaculties,
        setSelectedFaculties,
        selectedDepartments,
        setSelectedDepartments,
        selectedOrganizerTypes,
        setSelectedOrganizerTypes,
        selectedLocationTypes,
        setSelectedLocationTypes,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
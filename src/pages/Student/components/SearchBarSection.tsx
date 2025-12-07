import React, { useState } from "react";
import { ChevronDown } from "./ChevronDown";
import { useFilters } from "./FilterContext";

interface SearchBarSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SearchBarSection: React.FC<SearchBarSectionProps> = ({ searchQuery, onSearchChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { selectedCategories, toggleCategory, dateRange, updateDateRange } = useFilters();

  const filterOptions = [
    "Social",
    "Career",
    "Academic",
    "Sports",
    "Volunteering",
  ] as const;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  return (
    <header className="relative w-full flex flex-col bg-[#3ebff666] px-0 py-[50px]">
      <div className="flex mx-auto w-[90%] max-w-[1400px] h-[50px] items-center gap-2.5 px-2.5 py-[13px] bg-[#ffffff66] rounded-[10px] mb-[30px]">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events by faculty, date, type, location or date..."
          className="w-full text-2xl font-light bg-transparent border-none outline-none"
        />
      </div>

      <div className="mx-auto w-[90%] max-w-[400px] flex flex-col gap-4 rounded-[10px] overflow-hidden">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-between p-3 w-full rounded-[7px] border border-black bg-transparent cursor-pointer"
          aria-expanded={isFilterOpen}
          aria-controls="filter-dropdown"
        >
          <span className="text-2xl font-bold">Filter</span>
          <ChevronDown className="w-6 h-6" />
        </button>

        {isFilterOpen && (
          <div id="filter-dropdown" className="flex flex-col gap-3 p-3 bg-white border rounded-md shadow-lg">
            <div>
              <span className="text-lg font-bold">Departments:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {filterOptions.map((option) => {
                  const normalized = option.toLowerCase();
                  const selected = selectedCategories.includes(normalized);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleCategory(normalized)}
                      className={`px-3 py-1 rounded-full border ${
                        selected
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-black"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <span className="text-lg font-bold">Date range:</span>
              <div className="flex gap-2">
                <input
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateChange}
                  className="p-2 border rounded"
                />
                <input
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateChange}
                  className="p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
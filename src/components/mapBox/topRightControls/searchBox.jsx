"use client";

import { forwardRef } from "react";
import { Search } from "lucide-react";

const SearchBox = forwardRef(function SearchBox(
  { value, onChange, placeholder = "작업영역/해역유형 검색" },
  ref,
) {
  return (
    <div className="relative">
      <Search
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-200/80"
      />
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-white/22 bg-white/10
                   pl-9 pr-3 text-sm text-slate-50 placeholder:text-indigo-100/65
                   focus:border-indigo-200/80 focus:outline-none focus:ring-2 focus:ring-indigo-300/45"
      />
    </div>
  );
});

export default SearchBox;

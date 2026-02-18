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
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-slate-700/70 bg-slate-950/80
                   pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-400
                   focus:border-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/35"
      />
    </div>
  );
});

export default SearchBox;

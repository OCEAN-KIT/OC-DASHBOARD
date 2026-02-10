"use client";

import { forwardRef } from "react";

const SearchBox = forwardRef(function SearchBox(
  { value, onChange, placeholder = "작업영역/해역유형 검색" },
  ref,
) {
  return (
    <input
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-9 rounded-lg bg-white/10 placeholder-white/50 px-3 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
    />
  );
});

export default SearchBox;

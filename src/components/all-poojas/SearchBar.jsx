"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  data = [],
  placeholder = "Search poojas...",
}) {
  const wrapperRef = useRef(null);

  const [query, setQuery] = useState(value || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(query.trimStart());
    }, 250);

    return () => clearTimeout(timer);
  }, [query, onChange]);

  useEffect(() => {
    function handleClick(e) {
      if (!wrapperRef.current?.contains(e.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  const suggestions = useMemo(() => {
    if (!query.trim()) {
      return data.slice(0, 5);
    }

    const q = query.toLowerCase();

    return data
      .filter((item) =>
        `${item.title}
        ${item.shortDescription}
        ${item.description}`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 5);
  }, [query, data]);

  function handleKeyDown(e) {
    if (!suggestions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelected((prev) =>
          prev >= suggestions.length - 1 ? 0 : prev + 1
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelected((prev) =>
          prev <= 0 ? suggestions.length - 1 : prev - 1
        );
        break;

      case "Enter":
        if (selected >= 0) {
          setQuery(suggestions[selected].title);
          onChange(suggestions[selected].title);
        }

        setShowSuggestions(false);
        break;

      case "Escape":
        setShowSuggestions(false);
        break;
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
    >
      <div
        className="
          flex
          items-center
          h-16
          rounded-r24
          border
          border-black/10
          bg-white
          px-s24
          shadow-sm
          transition-all
          duration-300
          focus-within:border-primary-main
          focus-within:shadow-xl
        "
      >
        <Search
          size={22}
          className="text-secondary shrink-0"
        />

        <input
          value={query}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(-1);
            setShowSuggestions(true);
          }}
          placeholder={placeholder}
          className="
            flex-1
            bg-transparent
            px-s16
            body-default
            outline-none
            text-main
            placeholder:text-secondary
          "
        />

        {!!query && (
          <button
            onClick={() => {
              setQuery("");
              onChange("");
            }}
            className="
              h-9
              w-9
              rounded-full
              hover:bg-secondary-main
              transition
              flex
              items-center
              justify-center
            "
          >
            <X
              size={18}
              className="text-secondary"
            />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          className="
            absolute
            left-0
            right-0
            mt-3
            rounded-r24
            border
            border-black/5
            bg-white
            shadow-xl
            overflow-hidden
            z-50
          "
        >
          {suggestions.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                setQuery(item.title);
                onChange(item.title);
                setShowSuggestions(false);
              }}
              className={`
                w-full
                px-s24
                py-s16
                text-left
                transition
                ${
                  selected === index
                    ? "bg-secondary-main"
                    : "hover:bg-gray-50"
                }
              `}
            >
              <p className="font-medium text-main">
                {item.title}
              </p>

              <p className="caption text-secondary mt-1">
                {item.shortDescription}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
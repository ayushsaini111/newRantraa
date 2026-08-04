"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function CustomDropdown({
  value,
  options,
  onChange,
  placeholder = "Select",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const selected =
    options.find((item) => item.value === value) ||
    options[0];

  return (
    <div
      ref={dropdownRef}
      className={`relative ${className}`}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex
          items-center
          justify-between
          gap-3
          min-w-[190px]
          h-11
          rounded-full
          border
          border-black/10
          bg-white
          px-5
          transition-all
          hover:border-primary-main
          hover:shadow-md
        "
      >
        <span className="body-small">
          {selected.label}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-full
            rounded-r24
            border
            border-black/5
            bg-white
            shadow-xl
            overflow-hidden
            z-50
          "
        >
          {options.map((item) => {
            const active =
              value === item.value;

            return (
              <button
                key={item.value}
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
                className={`
                  w-full
                  px-5
                  py-3
                  flex
                  items-center
                  justify-between
                  transition
                  ${
                    active
                      ? "bg-primary-main/10"
                      : "hover:bg-gray-50"
                  }
                `}
              >
                <span>{item.label}</span>

                {active && (
                  <Check
                    size={16}
                    className="text-primary-main"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
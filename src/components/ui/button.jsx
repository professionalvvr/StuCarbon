import React from "react";

export function Button({ variant = "default", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2";
  const variants = {
    default: "bg-stone-900 text-white hover:bg-stone-800",
    secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200",
    ghost: "bg-transparent hover:bg-stone-100",
    emerald: "bg-emerald-600 text-white hover:bg-emerald-700", // ✅ green
  };
  const cls = `${base} ${variants[variant] || variants.default} ${className}`;
  return <button className={cls} {...props} />;
}

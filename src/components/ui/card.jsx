import React from 'react';

export function Card({ className = "", ...props }) {
  return <div className={["rounded-2xl border bg-white shadow-sm", className].join(" ")} {...props} />;
}
export function CardHeader({ className = "", ...props }) {
  return <div className={["p-4 border-b border-stone-100 flex items-center justify-between", className].join(" ")} {...props} />;
}
export function CardContent({ className = "", ...props }) {
  return <div className={["p-4", className].join(" ")} {...props} />;
}
export function CardTitle({ className = "", ...props }) {
  return <div className={["text-lg font-semibold", className].join(" ")} {...props} />;
}
export function CardDescription({ className = "", ...props }) {
  return <div className={["text-sm text-stone-500", className].join(" ")} {...props} />;
}

export default Card;

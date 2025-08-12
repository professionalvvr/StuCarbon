import React from 'react';

export function Progress({ value = 0, color = 'bg-emerald-500' }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="h-2 w-full bg-stone-200 rounded-full">
      <div
        className={`h-2 ${color}`}
        style={{
          width: `${pct}%`,
          borderTopLeftRadius: 0,     // flat start
          borderBottomLeftRadius: 0,  // flat start
          borderTopRightRadius: '9999px',  // rounded end
          borderBottomRightRadius: '9999px', // rounded end
        }}
      />
    </div>
  );
}

export default Progress;

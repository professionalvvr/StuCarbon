import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  School2,
  Loader2,
  Share2,
  RefreshCw,
  Info,
  Smartphone,
  Clock,
  MapPin,
  BarChart3,
  Lightbulb,
  Leaf,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/**
 * StuCarbon — full app (no backticks anywhere)
 * - Personalized tips with emojis
 * - Per-tip savings + combined savings block
 * - Privacy / Terms / Contact / FAQ / Sitemap pages
 * - Cookie consent banner
 */

// -------------------------- Utilities --------------------------
const TREE_OFFSET_TON_PER_YEAR = 0.021;
const CLIMATE_TARGET_TON = 2.0;
const STUDENT_GLOBAL_AVG_TON = 3.5;

const COUNTRIES = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "GL", name: "Global Avg", flag: "🌍" },
];

const countryFactors = {
  IN: { electricity: 0.65, transport: 0.6, food: 0.8, shopping: 0.8, digital: 0.7, housing: 0.8, misc: 0.8 },
  US: { electricity: 1.0, transport: 1.2, food: 1.1, shopping: 1.1, digital: 1.0, housing: 1.1, misc: 1.0 },
  GB: { electricity: 0.7, transport: 0.9, food: 0.9, shopping: 0.95, digital: 0.9, housing: 0.9, misc: 0.95 },
  AU: { electricity: 0.9, transport: 1.0, food: 1.0, shopping: 1.0, digital: 1.0, housing: 1.0, misc: 1.0 },
  DE: { electricity: 0.6, transport: 0.9, food: 0.9, shopping: 0.95, digital: 0.9, housing: 0.9, misc: 0.95 },
  GL: { electricity: 0.85, transport: 1.0, food: 1.0, shopping: 1.0, digital: 1.0, housing: 1.0, misc: 1.0 },
};

// Silent country detection: IP first (no prompt), then locale fallback, then GL.
async function detectCountryBetter() {
  // 1) Try IP-based country (silent)
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    const ipCode = data && data.country ? String(data.country).toUpperCase() : null;
    if (ipCode) return ipCode;
  } catch {
    // ignore network/JSON errors
  }

  // 2) Fallback: reuse your existing locale guess (silent)
  try {
    return guessCountryCode();
  } catch {
    // ignore
  }

  // 3) Default
  return "GL";
}

// -------------------------- Question Banks --------------------------
const baseQuestions = {
  middle: [
    { id: "school_commute", cat: "transport", title: "How do you usually get to school?", options: [
      { label: "Walk / Cycle", value: 0.02, emoji: "🚶" },
      { label: "School bus", value: 0.08, emoji: "🚌" },
      { label: "Car ride", value: 0.15, emoji: "🚗" },
    ]},
    { id: "home_cooling", cat: "housing", title: "AC or fan use at home (typical day)", options: [
      { label: "Rare", value: 0.05, emoji: "🧊" },
      { label: "1–4 hrs/day", value: 0.12, emoji: "🌬️" },
      { label: "> 4 hrs/day", value: 0.22, emoji: "🔥" },
    ]},
    { id: "diet", cat: "food", title: "Your usual diet", options: [
      { label: "Vegetarian/plant-forward", value: 0.18, emoji: "🥗" },
      { label: "Mixed (some meat)", value: 0.28, emoji: "🍳" },
      { label: "Meat often (several times/week)", value: 0.45, emoji: "🍗" },
    ]},
    { id: "screen_time", cat: "digital", title: "Daily screen time (study + fun)", options: [
      { label: "Under 2 hrs", value: 0.03, emoji: "📱" },
      { label: "2–5 hrs", value: 0.07, emoji: "💻" },
      { label: "Over 5 hrs", value: 0.12, emoji: "🖥️" },
    ]},
    { id: "snacks_drinks", cat: "misc", title: "Packaged snacks & fizzy drinks", options: [
      { label: "Rare", value: 0.03, emoji: "🥤" },
      { label: "Sometimes", value: 0.06, emoji: "🍫" },
      { label: "Often", value: 0.1, emoji: "🍬" },
    ]},
    { id: "shower_length", cat: "housing", title: "Average shower length", options: [
      { label: "Under 5 min", value: 0.02, emoji: "🚿" },
      { label: "5–10 min", value: 0.05, emoji: "🛁" },
      { label: "Over 10 min", value: 0.08, emoji: "💧" },
    ]},
    { id: "laundry_temp", cat: "housing", title: "Laundry water temperature", options: [
      { label: "Cold", value: 0.01, emoji: "🧺" },
      { label: "Warm", value: 0.03, emoji: "♨️" },
      { label: "Hot", value: 0.06, emoji: "🔥" },
    ]},
    { id: "bulbs", cat: "housing", title: "Light bulbs at home", options: [
      { label: "Mostly LED", value: 0.01, emoji: "💡" },
      { label: "Mixed", value: 0.03, emoji: "🔆" },
      { label: "Mostly old bulbs", value: 0.06, emoji: "🔌" },
    ]},
    { id: "standby_power", cat: "housing", title: "Do you unplug chargers/devices?", options: [
      { label: "Always", value: 0.01, emoji: "🔋" },
      { label: "Sometimes", value: 0.03, emoji: "🔌" },
      { label: "Rarely", value: 0.05, emoji: "⚡" },
    ]},
    { id: "recycling", cat: "misc", title: "Recycling at home/school", options: [
      { label: "Most items", value: 0.01, emoji: "♻️" },
      { label: "Some items", value: 0.03, emoji: "🧴" },
      { label: "None", value: 0.06, emoji: "🗑️" },
    ]},
    { id: "single_use", cat: "misc", title: "Single-use plastic (bottles/bags)", options: [
      { label: "Rare (reusable bottle/bag)", value: 0.01, emoji: "🥤" },
      { label: "Sometimes", value: 0.03, emoji: "🛍️" },
      { label: "Often", value: 0.06, emoji: "🧃" },
    ]},
    { id: "local_food", cat: "food", title: "Local/seasonal food choices", options: [
      { label: "Often", value: 0.02, emoji: "🥦" },
      { label: "Sometimes", value: 0.05, emoji: "🍎" },
      { label: "Rare", value: 0.08, emoji: "🍓" },
    ]},
    { id: "eating_out", cat: "food", title: "Eating out / delivery", options: [
      { label: "Under 1×/week", value: 0.03, emoji: "🍽️" },
      { label: "1–3×/week", value: 0.06, emoji: "🍔" },
      { label: "Over 3×/week", value: 0.1, emoji: "🍟" },
    ]},
    { id: "paper_use", cat: "shopping", title: "Paper use (notebooks/prints)", options: [
      { label: "Low / mostly digital", value: 0.02, emoji: "📱" },
      { label: "Mixed", value: 0.04, emoji: "📒" },
      { label: "High", value: 0.07, emoji: "📄" },
    ]},
    { id: "secondhand_books", cat: "shopping", title: "Second-hand books / sharing", options: [
      { label: "Often", value: 0.01, emoji: "📚" },
      { label: "Sometimes", value: 0.03, emoji: "🔖" },
      { label: "Rare", value: 0.06, emoji: "🧾" },
    ]},
    { id: "water_heating_ms", cat: "housing", title: "Water heating at home", options: [
      { label: "Solar / heat pump", value: 0.02, emoji: "☀️" },
      { label: "Electric", value: 0.05, emoji: "🔌" },
      { label: "Gas", value: 0.08, emoji: "🔥" },
    ]},
  ],
  high: [
    { id: "school_commute", cat: "transport", title: "How do you usually get to school? (most days)", options: [
      { label: "Walk or cycle", value: 0.02, emoji: "🚶" },
      { label: "Public bus/metro", value: 0.07, emoji: "🚈" },
      { label: "Car or motorbike", value: 0.18, emoji: "🏍️" },
    ]},
    { id: "distance_school", cat: "transport", title: "Approx one-way distance to school", options: [
      { label: "Under 2 km (1.2 mi)", value: 0.02, emoji: "📏" },
      { label: "2–8 km (1–5 mi)", value: 0.05, emoji: "🛤️" },
      { label: "> 8 km (>5 mi)", value: 0.1, emoji: "🛣️" },
    ]},
    { id: "electricity_saving", cat: "housing", title: "When leaving a room: lights/fans off?", options: [
      { label: "Always (habit)", value: 0.03, emoji: "💡" },
      { label: "Sometimes", value: 0.07, emoji: "🕯️" },
      { label: "Rarely", value: 0.12, emoji: "⚡" },
    ]},
    { id: "ac_use", cat: "housing", title: "AC or heater on a typical day", options: [
      { label: "Rare (only hot/cold waves)", value: 0.04, emoji: "🧊" },
      { label: "1–4 hrs/day", value: 0.1, emoji: "🌬️" },
      { label: "> 4 hrs/day", value: 0.2, emoji: "🔥" },
    ]},
    { id: "diet", cat: "food", title: "Your usual diet", options: [
      { label: "Vegetarian/plant-forward", value: 0.18, emoji: "🥗" },
      { label: "Mixed (some meat)", value: 0.3, emoji: "🍳" },
      { label: "Meat often (several times/week)", value: 0.5, emoji: "🍗" },
    ]},
    { id: "red_meat", cat: "food", title: "Red meat (beef/lamb) per week", options: [
      { label: "0–1 meals/week", value: 0.04, emoji: "🥩" },
      { label: "2–3 meals/week", value: 0.09, emoji: "🍖" },
      { label: "> 3 meals/week", value: 0.16, emoji: "🍔" },
    ]},
    { id: "dairy", cat: "food", title: "Dairy servings per day (milk/cheese)", options: [
      { label: "0–1", value: 0.03, emoji: "🥛" },
      { label: "2–3", value: 0.06, emoji: "🧀" },
      { label: "> 3", value: 0.09, emoji: "🍦" },
    ]},
    { id: "clothes_buy", cat: "shopping", title: "Buying new clothes (not used/thrift)", options: [
      { label: "Rare / Thrift / Swap", value: 0.05, emoji: "🧥" },
      { label: "Every 2–3 months", value: 0.1, emoji: "👚" },
      { label: "Monthly splurge", value: 0.18, emoji: "🛍️" },
    ]},
    { id: "screen_time", cat: "digital", title: "Screen time (study + fun) on weekdays", options: [
      { label: "Under 2 hrs/day", value: 0.03, emoji: "📱" },
      { label: "2–5 hrs/day", value: 0.08, emoji: "💻" },
      { label: "> 5 hrs/day", value: 0.14, emoji: "🖥️" },
    ]},
    { id: "gaming_hours", cat: "digital", title: "Gaming hours per week", options: [
      { label: "Under 3 hrs", value: 0.02, emoji: "🎮" },
      { label: "3–7 hrs", value: 0.05, emoji: "🕹️" },
      { label: "> 7 hrs", value: 0.1, emoji: "🧩" },
    ]},
    { id: "device_upgrades", cat: "shopping", title: "New phone/tablet upgrade cycle", options: [
      { label: "Over 3 years", value: 0.02, emoji: "📵" },
      { label: "2–3 years", value: 0.05, emoji: "📲" },
      { label: "Under 2 years", value: 0.1, emoji: "✨" },
    ]},
    { id: "delivery_freq", cat: "shopping", title: "Online delivery frequency (all items)", options: [
      { label: "Less than 1×/month", value: 0.02, emoji: "📦" },
      { label: "1–3×/month", value: 0.05, emoji: "🚚" },
      { label: "More than 3×/month", value: 0.1, emoji: "🛒" },
    ]},
    { id: "ride_share", cat: "transport", title: "Carpooling / ride-share", options: [
      { label: "Often (weekly)", value: 0.03, emoji: "🚗" },
      { label: "Sometimes", value: 0.06, emoji: "🚘" },
      { label: "Never", value: 0.11, emoji: "🚙" },
    ]},
    { id: "food_waste", cat: "food", title: "Throwing away uneaten food", options: [
      { label: "Rarely (plan leftovers)", value: 0.02, emoji: "🥫" },
      { label: "Sometimes", value: 0.05, emoji: "🍞" },
      { label: "Often", value: 0.09, emoji: "🗑️" },
    ]},
    { id: "water_heating", cat: "housing", title: "Water heating at home", options: [
      { label: "Solar / heat pump", value: 0.02, emoji: "☀️" },
      { label: "Electric", value: 0.05, emoji: "🔌" },
      { label: "Gas", value: 0.08, emoji: "🔥" },
    ]},
    { id: "paperless", cat: "shopping", title: "Notes & homework: paper vs digital", options: [
      { label: "Mostly digital", value: 0.02, emoji: "📱" },
      { label: "Mix of both", value: 0.04, emoji: "🗒️" },
      { label: "Mostly paper/prints", value: 0.07, emoji: "🖨️" },
    ]},
    { id: "recycling_hs", cat: "misc", title: "Recycling at home/school", options: [
      { label: "Most items (paper/plastic/e-waste)", value: 0.01, emoji: "♻️" },
      { label: "Some items", value: 0.03, emoji: "🧴" },
      { label: "None", value: 0.06, emoji: "🗑️" },
    ]},
  ],
  college: [
    { id: "campus_commute", cat: "transport", title: "Weekly commute to campus (most weeks)", options: [
      { label: "Walk/Cycle/e-scooter", value: 0.04, emoji: "🚲" },
      { label: "Public transit", value: 0.1, emoji: "🚇" },
      { label: "Car/Motorbike", value: 0.28, emoji: "🚗" },
    ]},
    { id: "room_cooling", cat: "housing", title: "AC/heater in your room (typical day)", options: [
      { label: "Rare", value: 0.06, emoji: "🧊" },
      { label: "1–4 hrs/day", value: 0.14, emoji: "🌬️" },
      { label: "> 4 hrs/day", value: 0.28, emoji: "🔥" },
    ]},
    { id: "diet", cat: "food", title: "Your usual diet", options: [
      { label: "Mostly plant-based", value: 0.2, emoji: "🥗" },
      { label: "Mixed (some meat)", value: 0.35, emoji: "🍳" },
      { label: "Meat often (several times/week)", value: 0.6, emoji: "🍗" },
    ]},
    { id: "short_flights", cat: "transport", title: "Short flights in last 12 months (<3h)", options: [
      { label: "0", value: 0.0, emoji: "🛫" },
      { label: "1–2", value: 0.4, emoji: "✈️" },
      { label: "> 2", value: 0.8, emoji: "🛬" },
    ]},
    { id: "long_flights", cat: "transport", title: "Long flights in last 12 months (>3h)", options: [
      { label: "0", value: 0.0, emoji: "🛫" },
      { label: "1", value: 0.9, emoji: "✈️" },
      { label: "> 1", value: 1.6, emoji: "🌏" },
    ]},
    { id: "online_stream", cat: "digital", title: "Weekly video streaming (HD/4K)", options: [
      { label: "Under 4 hrs", value: 0.05, emoji: "📺" },
      { label: "4–10 hrs", value: 0.12, emoji: "🎬" },
      { label: "Over 10 hrs", value: 0.22, emoji: "🖥️" },
    ]},
    { id: "gaming_pc", cat: "digital", title: "Gaming mostly on…", options: [
      { label: "Mobile/Console", value: 0.04, emoji: "📱" },
      { label: "Laptop", value: 0.08, emoji: "💻" },
      { label: "Desktop PC", value: 0.14, emoji: "🖥️" },
    ]},
    { id: "shopping", cat: "shopping", title: "New gadgets/clothes purchase frequency", options: [
      { label: "Rare / Thrift / Refurb", value: 0.06, emoji: "♻️" },
      { label: "Quarterly", value: 0.12, emoji: "📦" },
      { label: "Monthly", value: 0.22, emoji: "🛍️" },
    ]},
    { id: "delivery_freq", cat: "shopping", title: "Online delivery frequency (all items)", options: [
      { label: "Less than 1×/month", value: 0.03, emoji: "📦" },
      { label: "1–3×/month", value: 0.06, emoji: "🚚" },
      { label: "More than 3×/month", value: 0.12, emoji: "🛒" },
    ]},
    { id: "dorm_appliances", cat: "housing", title: "Appliances in room (kettle/fridge/etc)", options: [
      { label: "Minimal", value: 0.04, emoji: "🥤" },
      { label: "Some", value: 0.09, emoji: "🍳" },
      { label: "Many", value: 0.15, emoji: "🍽️" },
    ]},
    { id: "heating_type", cat: "housing", title: "Heating type in accommodation", options: [
      { label: "Heat pump / district", value: 0.05, emoji: "🏘️" },
      { label: "Electric", value: 0.1, emoji: "🔌" },
      { label: "Gas", value: 0.16, emoji: "🔥" },
    ]},
    { id: "food_waste", cat: "food", title: "Throwing away uneaten food", options: [
      { label: "Rarely (plan leftovers)", value: 0.02, emoji: "🥫" },
      { label: "Sometimes", value: 0.05, emoji: "🍞" },
      { label: "Often", value: 0.09, emoji: "🗑️" },
    ]},
    { id: "eat_out", cat: "food", title: "Eating out / delivery", options: [
      { label: "Under 1×/week", value: 0.04, emoji: "🍽️" },
      { label: "1–3×/week", value: 0.08, emoji: "🍔" },
      { label: "Over 3×/week", value: 0.14, emoji: "🍟" },
    ]},
    { id: "car_miles", cat: "transport", title: "Weekly car/motorbike distance", options: [
      { label: "Under 10 km (6 mi)", value: 0.04, emoji: "🛣️" },
      { label: "10–40 km (6–25 mi)", value: 0.12, emoji: "🛞" },
      { label: "Over 40 km (>25 mi)", value: 0.24, emoji: "⛽" },
    ]},
    { id: "ride_share", cat: "transport", title: "Carpooling / ride-share", options: [
      { label: "Often (weekly)", value: 0.03, emoji: "🚗" },
      { label: "Sometimes", value: 0.06, emoji: "🚘" },
      { label: "Never", value: 0.11, emoji: "🚙" },
    ]},
    { id: "recycling", cat: "misc", title: "Recycling in dorm/home", options: [
      { label: "Most items", value: 0.01, emoji: "♻️" },
      { label: "Some items", value: 0.03, emoji: "🧴" },
      { label: "None", value: 0.06, emoji: "🗑️" },
    ]},
    { id: "single_use", cat: "misc", title: "Single-use plastics (bottles/bags)", options: [
      { label: "Rare (reusable bottle/bag)", value: 0.01, emoji: "🥤" },
      { label: "Sometimes", value: 0.03, emoji: "🛍️" },
      { label: "Often", value: 0.06, emoji: "🧃" },
    ]},
    { id: "distance_campus", cat: "transport", title: "Approx one-way distance to campus", options: [
      { label: "Under 2 km (1.2 mi)", value: 0.03, emoji: "📏" },
      { label: "2–8 km (1–5 mi)", value: 0.07, emoji: "🛤️" },
      { label: "> 8 km (>5 mi)", value: 0.12, emoji: "🛣️" },
    ]},
    { id: "bike_access", cat: "transport", title: "Do you have easy access to a cycle/e-scooter?", options: [
      { label: "Yes, I use it", value: 0.02, emoji: "🚴" },
      { label: "Sometimes", value: 0.05, emoji: "🛴" },
      { label: "No", value: 0.09, emoji: "🚶" },
    ]},
    { id: "green_power", cat: "housing", title: "Does your housing use any green electricity (renewable/green tariff)?", options: [
      { label: "Yes / part of it", value: 0.04, emoji: "🌱" },
      { label: "Not sure", value: 0.07, emoji: "❓" },
      { label: "No", value: 0.1, emoji: "⚡" },
    ]},
    { id: "thermostat", cat: "housing", title: "Thermostat setting (heating/cooling) most days", options: [
      { label: "Eco (18–20°C / 64–68°F)", value: 0.04, emoji: "🌡️" },
      { label: "Normal (21–23°C / 70–73°F)", value: 0.07, emoji: "🏠" },
      { label: "Warm/Cool (24+°C or <18°C)", value: 0.12, emoji: "🔥" },
    ]},
    { id: "paperless_college", cat: "shopping", title: "Notes & coursework: paper vs digital", options: [
      { label: "Mostly digital", value: 0.02, emoji: "📱" },
      { label: "Mix of both", value: 0.04, emoji: "🗒️" },
      { label: "Mostly paper/prints", value: 0.07, emoji: "🖨️" },
    ]},
  ],
};

const CATEGORY_LABELS = {
  housing: "Housing",
  transport: "Transport",
  food: "Food",
  digital: "Digital",
  shopping: "Shopping",
  misc: "Misc",
};

// -------------------------- NEW: Tip Builder --------------------------
function derivePersonalizedTips(answers, countryCode, total) {
  const cf = countryFactors[countryCode] || countryFactors.GL;
  const tips = [];

  const EMO = {
    reduce_ac: "❄️",
    commute_active: "🚶‍♀️",
    diet_shift: "🥦",
    red_meat_cut: "🍔➡️🥚",
    stream_smart: "📥",
    thrift_refurb: "♻️",
    skip_short_flight: "🚄",
    skip_long_flight: "🗺️",
    shower_short: "⏱️🚿",
    laundry_cold: "🧺❄️",
    reuse: "👜",
    trip_chain: "🤝🛣️",
  };

  const add = (id, title, description, impact) => {
    const safeImpact = Math.max(0, Number((impact || 0).toFixed(3)));
    if (safeImpact <= 0.0009) return;
    tips.push({ id, title, description, impact: safeImpact, emoji: EMO[id] || "💡" });
  };

  const qVal = (key) => {
    const a = answers[key];
    if (!a) return 0;
    const f = cf[a.cat] != null ? cf[a.cat] : 1;
    return (a.value || 0) * f;
  };

  const cool = answers.ac_use || answers.room_cooling || answers.home_cooling;
  if (cool && (cool.label === "1–4 hrs/day" || cool.label === "> 4 hrs/day")) {
    const key = answers.ac_use ? "ac_use" : (answers.room_cooling ? "room_cooling" : "home_cooling");
    const base = qVal(key);
    const frac = cool.label === "> 4 hrs/day" ? 0.25 : 0.20;
    add(
      "reduce_ac",
      "Cut AC/heater by ~1 hour each day",
      "Set 24–26°C, use a fan first, close doors/windows. Small habits, easy comfort.",
      base * frac
    );
  }

  const commute = answers.campus_commute || answers.school_commute;
  if (commute && (commute.label === "Car/Motorbike" || commute.label === "Car or motorbike" || commute.label === "Car ride")) {
    const key = answers.campus_commute ? "campus_commute" : "school_commute";
    const base = qVal(key);
    add(
      "commute_active",
      "Swap 2 commute days for walking/cycling/transit",
      "Walk part way, cycle/e-scooter, or take bus/metro. Try park-and-ride or carpool once.",
      base * 0.40
    );
  }

  const diet = answers.diet;
  if (diet && (diet.label.indexOf("Mixed") === 0 || diet.label.indexOf("Meat often") === 0)) {
    const base = qVal("diet");
    const frac = diet.label.indexOf("Meat often") === 0 ? 0.35 : 0.25;
    add(
      "diet_shift",
      "Go meat-free 3 days each week",
      "Plan simple meals: beans/lentils, paneer/tofu, veggie stir-fries. Swap some red meat for eggs/chicken.",
      base * frac
    );
  }

  const red = answers.red_meat;
  if (red && red.label !== "0–1 meals/week") {
    const base = qVal("red_meat");
    add("red_meat_cut", "Halve your red-meat meals", "Replace half with chicken/eggs/beans. Same protein, cheaper, lower impact.", base * 0.50);
  }

  const stream = answers.online_stream || answers.screen_time;
  if (stream) {
    const key = answers.online_stream ? "online_stream" : "screen_time";
    const base = qVal(key);
    if (stream.label === "Over 10 hrs" || stream.label === "Over 5 hrs") {
      add("stream_smart", "Download or use SD on phone", "Download shows you rewatch. Turn off autoplay at night.", base * 0.30);
    } else if (stream.label === "4–10 hrs" || stream.label === "2–5 hrs") {
      add("stream_smart", "Stream smarter on mobile", "Use SD on phone/tablet and download long videos.", base * 0.20);
    }
  }

  const shopKey = answers.shopping ? "shopping" : (answers.clothes_buy ? "clothes_buy" : (answers.device_upgrades ? "device_upgrades" : null));
  if (shopKey) {
    const shop = answers[shopKey];
    if (shop && (shop.label === "Monthly" || shop.label === "Monthly splurge" || shop.label === "Every 2–3 months" || shop.label === "2–3 years" || shop.label === "Under 2 years")) {
      const base = qVal(shopKey);
      add("thrift_refurb", "Skip one new item this term (choose thrift/refurb)", "Thrift first, repair if possible, or borrow/share. Many items feel new after a clean/case.", base * 0.30);
    }
  }

  if (answers.short_flights && answers.short_flights.label !== "0") {
    add("skip_short_flight", "Replace one short flight with train/bus", "Pick rail/bus once this year. Often cheaper and faster door-to-door.", 0.20 * (cf.transport || 1));
  }

  if (answers.long_flights && answers.long_flights.label !== "0") {
    add("skip_long_flight", "Avoid one long flight this year", "Combine trips or choose a closer destination once this year.", 0.90 * (cf.transport || 1));
  }

  const shower = answers.shower_length;
  if (shower && (shower.label === "5–10 min" || shower.label === "Over 10 min")) {
    const base = qVal("shower_length");
    const frac = shower.label === "Over 10 min" ? 0.40 : 0.25;
    add("shower_short", "Shorten showers by 3–5 minutes", "Set a timer, turn water off while soaping, and use a low-flow shower head if you can.", base * frac);
  }

  const laundry = answers.laundry_temp;
  if (laundry && (laundry.label === "Warm" || laundry.label === "Hot")) {
    const base = qVal("laundry_temp");
    const frac = laundry.label === "Hot" ? 0.70 : 0.40;
    add("laundry_cold", "Wash clothes in cold water", "Cold cycles clean most daily clothes and save energy. Use warm only for very soiled loads.", base * frac);
  }

  const sup = answers.single_use;
  if (sup && (sup.label === "Sometimes" || sup.label === "Often")) {
    const base = qVal("single_use");
    add("reuse", "Carry a bottle and bag", "Keep a metal/plastic bottle and a foldable tote in your backpack. Say no to bottles/bags.", base * 0.60);
  }

  const ride = answers.ride_share;
  if (ride && ride.label !== "Often (weekly)") {
    const base = qVal("ride_share");
    add("trip_chain", "Carpool and combine errands", "Share rides with classmates and do several errands in one loop to cut extra trips.", base * 0.40);
  }

  tips.sort((a, b) => b.impact - a.impact);
  return tips.slice(0, 5);
}

// -------------------------- App Shell --------------------------
const Page = ({ children }) => (
  <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(16,185,129,0.25),transparent_60%)] bg-emerald-50 text-stone-800">
    <div className="mx-auto w-full max-w-6xl px-4 py-8">{children}</div>
  </div>
);

export default function App() {
  const { path, push } = useHashRoute();
  const [country, setCountry] = useState(guessCountryCode());
  const [grade, setGrade] = useState(null);
  const [answers, setAnswers] = useState({});
  const [footprintId, setFootprintId] = useState(null);

  const questions = useMemo(() => (grade ? baseQuestions[grade] : []), [grade]);

  const breakdown = useMemo(() => {
    const cf = countryFactors[country] || countryFactors.GL;
    const acc = { housing: 0, transport: 0, food: 0, digital: 0, shopping: 0, misc: 0 };
    for (const q of questions) {
      const a = answers[q.id];
      if (!a) continue;
      acc[q.cat] += a.value * (cf[q.cat] ?? 1);
    }
    return acc;
  }, [answers, questions, country]);

  const total = useMemo(() => Object.values(breakdown).reduce((s, v) => s + v, 0), [breakdown]);
  const countryMeta = COUNTRIES.find((c) => c.code === country) || COUNTRIES[COUNTRIES.length - 1];

  const startCalc = () => {
    setGrade(null);
    setAnswers({});
    push("/calculator");
  };

  const goResults = () => {
    const id = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    setFootprintId(id);
    push("/loading");
    setTimeout(() => push("/results?id=" + id), 850);
  };

  useEffect(() => {
    if (!window.location.hash) push("/");
  }, []);

  useEffect(() => {
    (async () => {
      const better = await detectCountryBetter();
      if (!better) return;
      const match = COUNTRIES.find((c) => c.code === better.toUpperCase());
      if (match) setCountry(match.code);
    })();
  }, []);

  return (
    <Page>
      <Header onHome={() => push("/")} onAbout={() => push("/about")} />
      <main className="mt-6">
        <AnimatePresence mode="wait">
          {path === "/" && <Welcome key="welcome" onStart={startCalc} />}
          {path.startsWith("/calculator") && (
            <Calculator
              key="calculator"
              country={country}
              setCountry={setCountry}
              countryMeta={countryMeta}
              grade={grade}
              setGrade={setGrade}
              questions={questions}
              answers={answers}
              setAnswers={setAnswers}
              total={total}
              onFinish={goResults}
            />
          )}
          {path === "/loading" && <Loading key="loading" />}
          {path.startsWith("/results") && (
            <Results key="results" total={total} breakdown={breakdown} answers={answers} countryMeta={countryMeta} onRecalc={startCalc} />
          )}
          {path === "/about" && <About key="about" onStart={startCalc} />}
          {path === "/privacy" && <Privacy key="privacy" />}
          {path === "/terms" && <Terms key="terms" />}
          {path === "/contact" && <Contact key="contact" />}
          {path === "/faq" && <FAQ key="faq" />}
          {path === "/sitemap" && <Sitemap key="sitemap" />}
        </AnimatePresence>
      </main>
      <CookieConsent />
      <Footer />
    </Page>
  );
}

// -------------------------- Header/Footer --------------------------
function Header({ onHome }) {
  return (
    <div className="flex items-center justify-center py-3">
      {/* Logo */}
      <button
        onClick={onHome}
        className="group inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur"
      >
        <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-white">
          <GraduationCap className="h-3 w-3" />
        </div>
        <span className="text-sm font-semibold text-stone-700">StuCarbon</span>
      </button>
    </div>
  );
}



function useHashRoute() {
  const get = () => (typeof window !== "undefined" ? window.location.hash.slice(1) || "/" : "/");
  const [path, setPath] = React.useState(get);

  React.useEffect(() => {
    const onHash = () => setPath(get());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const push = (to) => {
    if (typeof window !== "undefined") {
      window.location.hash = to;
      setPath(to);
    }
  };

  return { path, push };
}


function Footer() {
  return (
    <div className="mt-10 flex flex-col items-center gap-2 text-center text-xs text-stone-500">
      <div className="whitespace-normal break-words max-w-full px-4">
        Built for students • Fast, mobile-first • See Methodology on the Results page
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => { window.location.hash = "/about"; }} className="underline">About</button>
        <button onClick={() => { window.location.hash = "/privacy"; }} className="underline">Privacy</button>
        <button onClick={() => { window.location.hash = "/terms"; }} className="underline">Terms</button>
        <button onClick={() => { window.location.hash = "/contact"; }} className="underline">Contact</button>
        <button onClick={() => { window.location.hash = "/sitemap"; }} className="underline">Sitemap</button>
      </div>
    </div>
  );
}


// -------------------------- Pages --------------------------
function Welcome({ onStart }) {
  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          Student <span className="text-emerald-600">Carbon Footprint</span> Calculator
        </h1>
        <div className="mt-6 flex justify-center">
          <Button onClick={onStart} className="rounded-full bg-emerald-600 px-6 py-6 text-base shadow-lg hover:shadow-xl">
            <Smartphone className="mr-2 h-5 w-5" /> Calculate My Footprint <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard icon={Clock} title="2 Minutes" desc={<><span>Complete your calculation in under </span><b>2 minutes</b>.</>} />
        <FeatureCard icon={MapPin} title="Country-Accurate" desc={<><span>Auto-detects your country for better </span><b>emission factors</b>.</>} />
        <FeatureCard icon={BarChart3} title="Personalized Data" desc={<><span>Get a clear breakdown with </span><b>simple charts</b>.</>} />
        <FeatureCard icon={Lightbulb} title="Actionable Tips" desc={<><span>Receive </span><b>practical steps</b><span> to reduce your impact.</span></>} />
      </div>
    </motion.section>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-emerald-50">
        <Icon className="h-6 w-6 text-emerald-600" />
      </div>
      <div className="text-center font-semibold">{title}</div>
      <div className="mt-1 text-center text-sm text-stone-600">{desc}</div>
    </div>
  );
}

function Calculator({ country, setCountry, countryMeta, grade, setGrade, questions, answers, setAnswers, total, onFinish }) {
  const [step, setStep] = useState(0);
  const AVG_SECONDS_PER_Q = 6;
  const [toast, setToast] = useState(null);

  useEffect(() => { setStep(0); }, [grade]);

  const currentQuestion = useMemo(() => { if (!grade) return null; const idx = step - 1; return questions[idx] || null; }, [step, grade, questions]);

  const progress = useMemo(() => { const count = grade ? questions.length : 1; const done = grade ? Math.max(0, Math.min(step - 1, count)) : 0; return Math.round((done / count) * 100); }, [step, grade, questions]);

  const answeredCount = useMemo(() => Object.keys(answers).filter((k) => questions.find((q) => q.id === k)).length, [answers, questions]);
  const remainingSeconds = Math.max(0, (questions.length - answeredCount) * AVG_SECONDS_PER_Q);

  const setAnswer = (q, opt) => {
    setAnswers((prev) => ({ ...prev, [q.id]: { ...opt, cat: q.cat } }));
    const minVal = Math.min(...q.options.map((o) => o.value));
    const isBest = opt.value === minVal;
    if (isBest) {
      const avgVal = q.options.reduce((s, o) => s + o.value, 0) / q.options.length;
      const better = Math.max(0, Math.round((1 - opt.value / avgVal) * 100));
      setToast({ title: "Nice low-impact pick!", detail: "~" + better + "% lower than what most students choose." });
    } else {
      if (toast) setToast(null);
    }
  };

  const canNext = grade ? (!!currentQuestion ? !!answers[currentQuestion.id] : true) : !!grade;
  const atLast = grade && step > 0 && step >= questions.length;

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-10 space-y-6">
      <Card className="border-0 bg-white/80 shadow-sm backdrop-blur">
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-stone-600">Using <span className="font-medium">{countryMeta.name}</span> data {countryMeta.flag}</div>
            <div className="text-sm text-stone-600">Current footprint: <span className="font-semibold">{total.toFixed(2)}</span> tCO₂/yr</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="country" className="text-xs text-stone-500">Change country</label>
            <select id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-full border px-3 py-2 text-sm shadow-sm">
              {COUNTRIES.map((c) => (<option key={c.code} value={c.code}>{c.flag} {c.name}</option>))}
            </select>
          </div>

          {!grade && (
            <div>
              <div className="mb-3 font-medium">Select your grade level</div>
              <div className="grid gap-3 sm:grid-cols-3">
                <GradeCard icon={School2} label="Middle School" onClick={() => setGrade("middle")} active={grade === "middle"} />
                <GradeCard icon={BookOpen} label="High School" onClick={() => setGrade("high")} active={grade === "high"} />
                <GradeCard icon={GraduationCap} label="College / University" onClick={() => setGrade("college")} active={grade === "college"} />
              </div>
            </div>
          )}

          {grade && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-stone-500">Question {Math.min(step || 1, questions.length)} of {questions.length} • {progress}%</div>
                <div className="flex items-center gap-4">
                  <div className="text-xs text-stone-500">≈ {Math.floor(remainingSeconds / 60)}m {String(Math.round(remainingSeconds % 60)).padStart(2, "0")}s left</div>
                  <div className="w-40 sm:w-56"><Progress value={progress} /></div>
                </div>
              </div>

            {toast && (
  <motion.div
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="relative inline-block w-auto max-w-full overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 shadow-sm"
  >
    <div className="flex flex-wrap items-start gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <motion.div
          initial={{ scale: 0.8, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600/90 text-white"
        >
          <Leaf className="h-4 w-4" />
        </motion.div>
        <div className="min-w-0">
          <div className="font-medium break-words">{toast.title}</div>
          <div className="text-emerald-900/80 break-words">{toast.detail}</div>
        </div>
      </div>
      <button
        onClick={() => setToast(null)}
        className="shrink-0 self-start rounded-full border border-emerald-300 px-2 text-xs"
      >
        Dismiss
      </button>
    </div>
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="pointer-events-none absolute -right-2 -top-2 select-none"
    >
      <div className="h-2 w-2 rounded-full bg-emerald-300"></div>
      <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></div>
      <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></div>
    </motion.div>
  </motion.div>
)}



              {step === 0 ? (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">Answer a few quick questions. Your totals adjust live with your country factors.</div>
              ) : currentQuestion ? (
                <div>
                 <div className="mb-3 text-lg font-medium">{currentQuestion.title}</div>
<div className="grid gap-3 sm:grid-cols-3">
  {[...currentQuestion.options, { label: "This doesn't apply to me", value: 0, emoji: "🚫" }].map((opt) => {
    const isSelected = answers[currentQuestion.id]?.label === opt.label;
    const btnCls =
      "rounded-2xl border p-4 text-left shadow-sm transition hover:shadow " +
      (isSelected ? "border-emerald-500 bg-emerald-50" : "bg-white");
    return (
      <button
        key={opt.label}
        onClick={() => setAnswer(currentQuestion, opt)}
        className={btnCls}
      >
        <div className="text-2xl">{opt.emoji}</div>
        <div className="mt-2 font-medium">{opt.label}</div>
      </button>
    );
  })}
</div>


                </div>
              ) : (
                <div className="text-sm text-stone-500">Review and finish to see results.</div>
              )}

              <div className="flex items-center justify-between">
                <Button variant="ghost" className="rounded-full" onClick={() => { setStep((s) => Math.max(0, s - 1)); if (toast) setToast(null); }} disabled={step === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                {atLast ? (
                  <Button className="rounded-full bg-emerald-600" onClick={onFinish}>Calculate <ArrowRight className="ml-2 h-4 w-4" /></Button>
                ) : (
                  <Button className="rounded-full" onClick={() => { setStep((s) => (s === 0 ? 1 : s + 1)); if (toast) setToast(null); }} disabled={!canNext}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
}

function Loading() {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-10">
      <Card className="border-0 bg-white/80 p-10 text-center shadow-sm backdrop-blur">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-600 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <div className="text-lg font-medium">Calculating your student footprint…</div>
        <div className="text-sm text-stone-500">Analyzing your lifestyle choices…</div>
      </Card>
    </motion.section>
  );
}

function Results({ total, breakdown, answers, countryMeta, onRecalc }) {
  const data = Object.entries(breakdown).map(([k, v]) => ({ name: CATEGORY_LABELS[k], value: Number(v.toFixed(3)) }));
  const trees = Math.ceil(total / TREE_OFFSET_TON_PER_YEAR);

  const tips = useMemo(() => derivePersonalizedTips(answers, countryMeta.code, total), [answers, countryMeta.code, total]);
  const combinedSave = tips.reduce((s, t) => s + t.impact, 0);
  const afterAll = Math.max(0, Number((total - combinedSave).toFixed(2)));
  const combinedPct = total > 0 ? Math.round((combinedSave / total) * 100) : 0;

  const share = async () => {
    const text = "My student carbon footprint is " + total.toFixed(2) + " tCO₂/yr — try yours at StuCarbon!";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Student Carbon Footprint Calculator", text });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Copied results to clipboard!");
      }
    } catch {}
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-10 space-y-6">
      <Card className="border-0 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Your Results</CardTitle>
          <CardDescription>Using {countryMeta.name} data {countryMeta.flag}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-sm text-stone-500">Total footprint</div>
            <div className="text-4xl font-semibold">{total.toFixed(2)} <span className="text-lg font-normal">tCO₂/yr</span></div>

            <div className="mt-4 grid gap-2">
              <CompareBar label="Climate Target (2.0)" value={total} target={CLIMATE_TARGET_TON} goodLower />
              <CompareBar label="Global Student Avg (3.5)" value={total} target={STUDENT_GLOBAL_AVG_TON} />
              <div className="text-sm text-stone-600">
                {total <= CLIMATE_TARGET_TON
                  ? "Excellent! You're at or below the climate target."
                  : total <= STUDENT_GLOBAL_AVG_TON
                  ? "You're around average for students globally — small changes can get you to the target."
                  : "You're above the student average. The tips below can help you cut emissions fast."}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
              <div className="text-sm text-emerald-900">Tree equivalent</div>
              <div className="text-2xl font-semibold text-emerald-900">{trees} trees</div>
              <div className="text-xs text-emerald-900/80">Assuming 1 tree ≈ 0.021 tCO₂/year</div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={onRecalc} className="rounded-full" variant="secondary"><RefreshCw className="mr-2 h-4 w-4" /> Recalculate</Button>
              <Button onClick={share} className="rounded-full bg-emerald-600"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="border-0">
              <CardHeader className="pb-2"><CardTitle className="text-lg">Emissions Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                  {data.map((d) => (
                    <div key={d.name} className="flex items-center justify-between rounded-xl border bg-white px-2 py-1">
                      <span>{d.name}</span>
                      <span className="font-medium">{d.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Personalized Action Plan</CardTitle>
                <CardDescription>Based on your answers — practical, easy steps with clear savings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tips.length === 0 && (
                  <div className="rounded-2xl border bg-white p-3 text-sm text-stone-600">
                    Great choices! We couldn't find obvious quick wins based on your answers. Try exploring more low-impact options in daily life.
                  </div>
                )}
                {tips.map((t) => {
                  const after = Math.max(0, Number((total - t.impact).toFixed(2)));
                  const pct = total > 0 ? Math.round((t.impact / total) * 100) : 0;
                  return (
                    <div key={t.id} className="rounded-2xl border bg-white p-3">
                      <div className="flex items-start gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-lg">{t.emoji || "💡"}</div>
                        <div className="flex-1">
                          <div className="font-medium">{t.title}</div>
                          <div className="text-sm text-stone-600 whitespace-pre-line">{t.description}</div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-stone-600">
                            <span className="rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-800">Save ≈ {t.impact.toFixed(2)} tCO₂/yr ({pct}%)</span>
                            <span>New total if you do just this: <b>{after.toFixed(2)}</b> tCO₂/yr</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {tips.length > 0 && (
                  <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3">
                    <div className="font-medium text-emerald-900">🧩 Do all of them together</div>
                    <div className="text-sm text-emerald-900/80">
                      Combined saving ≈ <b>{combinedSave.toFixed(2)}</b> tCO₂/yr ({combinedPct}%). Your footprint could drop to <b>{afterAll.toFixed(2)}</b> tCO₂/yr.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Methodology />
    </motion.section>
  );
}

function CompareBar({ label, value, target, goodLower = false }) {
  const pct = Math.min(100, Math.round((Math.min(value, target) / target) * 100));
  const barColor = goodLower ? "bg-emerald-500" : "bg-sky-500";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-stone-600">
        <span>{label}</span>
        <span>{value.toFixed(2)} / {target} t</span>
      </div>
      <div className="h-2 w-full rounded-full bg-stone-200">
        <div className={"h-2 rounded-full " + barColor} style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}

function Methodology() {
  const [open, setOpen] = useState(false);
  return (
    <Card className="border-0 bg-white/80 shadow-sm backdrop-blur">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Methodology</CardTitle>
          <CardDescription>How the Student Carbon Footprint Calculator works</CardDescription>
        </div>
        <Button variant="ghost" className="rounded-full" onClick={() => setOpen((o) => !o)}><Info className="mr-2 h-4 w-4" />{open ? "Hide" : "Show"}</Button>
      </CardHeader>
      {open && (
        <CardContent className="space-y-2 text-sm text-stone-700">
          <p>StuCarbon uses simple, transparent estimates tuned for students. Each answer adds a small annual CO₂e value (tons/year) to one category. Country factors scale categories to reflect electricity mix, transport patterns, and diet differences.</p>
          <p>Data inspiration: IPCC (energy & heating factors), FAO (diet footprints), IEA (power mix), Our World in Data. Values are simplified so results stay easy to understand.</p>
          <p>Targets: Climate target at 2.0 tCO₂/yr; Student global average at 3.5 tCO₂/yr. Tree equivalent assumes 1 tree ≈ 0.021 tCO₂/year.</p>
        </CardContent>
      )}
    </Card>
  );
}

function About({ onStart }) {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <Card className="border-0 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">About StuCarbon</CardTitle>
          <CardDescription>Student-first. Fast. Clear. Actionable.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-stone-700">
          <p>StuCarbon is the minimal, modern <b>Student Carbon Footprint Calculator</b> that helps middle-school, high-school, and college students understand their personal carbon footprint and reduce it with practical steps.</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Under-2-minute questionnaire with dynamic, student-specific questions.</li>
            <li>Country-aware results so your context actually matters.</li>
            <li>Clear visuals: breakdown list, tree equivalents, and simple comparison bars.</li>
            <li>Personalized action plan that adapts to your answers.</li>
          </ul>
          <Button onClick={onStart} className="rounded-full bg-emerald-600">Try the calculator</Button>
        </CardContent>
      </Card>
    </motion.section>
  );
}

// -------------------------- Legal / Support Pages --------------------------
function Privacy() {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <Card className="border-0 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Privacy Policy</CardTitle>
          <CardDescription>How we handle data, cookies, and ads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-stone-700">
          <p>We respect your privacy. StuCarbon collects minimal information to run this calculator and improve the experience (such as anonymous usage analytics). We don’t collect sensitive personal information.</p>
          <p><b>Cookies:</b> We use cookies to remember settings and for analytics. We also use Google AdSense to show ads. Google and other third-party vendors may use cookies (including the DoubleClick cookie) to serve ads based on your visits to this and other sites.</p>
          <p><b>Managing cookies & ads:</b> You can opt out of personalised advertising by visiting <a className="underline" href="https://adssettings.google.com/authenticated" target="_blank" rel="noreferrer">Google Ads Settings</a> and learn more at <a className="underline" href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">Google’s advertising policies</a>.</p>
          <p><b>Links:</b> Our site may link to external pages. We are not responsible for their content or privacy practices.</p>
          <p><b>Contact:</b> For privacy questions, email us at <a className="underline" href="mailto:hello@stucarbon.app">hello@stucarbon.app</a>.</p>
          <p className="text-xs text-stone-500">Last updated: {new Date().toISOString().slice(0, 10)}</p>
        </CardContent>
      </Card>
    </motion.section>
  );
}

function Terms() {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <Card className="border-0 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Terms of Use</CardTitle>
          <CardDescription>Simple rules for using StuCarbon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-stone-700">
          <p>StuCarbon provides educational estimates only. Results are approximate and should not be used for official reporting or compliance.</p>
          <p>By using this site you agree not to misuse it, attempt to break security, or auto-scrape. All content is provided “as is,” without warranties. We are not liable for any damages arising from use of the site.</p>
          <p>We may update these terms and will post the new date here.</p>
          <p><b>Contact:</b> <a className="underline" href="mailto:hello@stucarbon.app">hello@stucarbon.app</a></p>
          <p className="text-xs text-stone-500">Last updated: {new Date().toISOString().slice(0, 10)}</p>
        </CardContent>
      </Card>
    </motion.section>
  );
}

function Contact() {
  const [name, setName] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const send = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent("StuCarbon support");
    const body = encodeURIComponent("Name: " + name + "\n\n" + msg);
    window.location.href = "mailto:hello@stucarbon.app?subject=" + subject + "&body=" + body;
  };
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <Card className="border-0 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Contact</CardTitle>
          <CardDescription>We usually respond within a few business days</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={send} className="space-y-3 text-sm">
            <div className="grid gap-1">
              <label className="text-stone-600">Your name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border p-2" required placeholder="Jane Student" />
            </div>
            <div className="grid gap-1">
              <label className="text-stone-600">Message</label>
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} className="min-h-[120px] rounded-xl border p-2" required placeholder="How can we help?" />
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" className="rounded-full bg-emerald-600">Send email</Button>
              <a href="mailto:hello@stucarbon.app" className="text-stone-600 underline">or email directly</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.section>
  );
}

function FAQ() {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <Card className="border-0 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">FAQ</CardTitle>
          <CardDescription>Quick answers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-stone-700">
          <div>
            <div className="font-medium">How accurate are the results?</div>
            <div>They’re educational estimates based on your answers and country factors. See Methodology for sources and assumptions.</div>
          </div>
          <div>
            <div className="font-medium">Will you sell my data?</div>
            <div>No. We don’t sell personal data. Ads are served by Google AdSense using its own cookies and policies.</div>
          </div>
          <div>
            <div className="font-medium">How do I reduce my footprint?</div>
            <div>Use your Personalized Action Plan. Each step shows practical actions, your potential saving, and the new total.</div>
          </div>
          <div>
            <div className="font-medium">Can I use this on my phone?</div>
            <div>Yes — the app is mobile-first and works great on small screens.</div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}

function Sitemap() {
  const links = [
    { label: "Home", to: "/" },
    { label: "Calculator", to: "/calculator" },
    { label: "Results", to: "/results" },
    { label: "About", to: "/about" },
    { label: "Privacy", to: "/privacy" },
    { label: "Terms", to: "/terms" },
    { label: "Contact", to: "/contact" },
    { label: "FAQ", to: "/faq" },
  ];
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <Card className="border-0 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Sitemap</CardTitle>
          <CardDescription>All main pages</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 text-sm">
          {links.map((l) => (
            <button key={l.to} onClick={() => { window.location.hash = l.to; }} className="rounded-xl border bg-white px-3 py-2 text-left shadow-sm hover:shadow">{l.label}</button>
          ))}
        </CardContent>
      </Card>
    </motion.section>
  );
}

function CookieConsent() {
  const [ok, setOk] = React.useState(() => typeof window !== "undefined" && localStorage.getItem("sc_cookie_ok") === "1");
  if (ok) return null;
  return (
    <div className="fixed bottom-3 inset-x-0 mx-auto w-[min(680px,92%)] rounded-2xl border bg-white/95 shadow-lg p-3 text-sm z-50">
      <div className="flex items-start gap-3">
        <div className="text-2xl">🍪</div>
        <div className="flex-1">
          <div className="font-medium">Cookies & Ads</div>
          <div className="text-stone-600">We use cookies for analytics and to show ads via Google AdSense. By using StuCarbon, you agree to our <a href="#/privacy" className="underline">Privacy Policy</a>.</div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="rounded-full" onClick={() => { window.location.hash = "/privacy"; }}>Learn more</Button>
          <Button className="rounded-full bg-emerald-600" onClick={() => { localStorage.setItem("sc_cookie_ok", "1"); setOk(true); }}>Accept</Button>
        </div>
      </div>
    </div>
  );
}

function GradeCard({ icon: Icon, label, onClick, active }) {
  const cls =
    "flex items-center gap-3 rounded-2xl border p-4 shadow-sm transition hover:shadow " +
    (active ? "border-emerald-500 bg-emerald-50" : "bg-white");
  return (
    <button onClick={onClick} className={cls}>
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white"><Icon className="h-5 w-5" /></div>
      <div className="text-left"><div className="font-medium">{label}</div><div className="text-xs text-stone-500">Tap to choose</div></div>
    </button>
  );
}

// -------------------------- Lightweight Tests --------------------------
export function computeBreakdown(answers, questions, countryCode) {
  const cf = countryFactors[countryCode] || countryFactors.GL;
  const acc = { housing: 0, transport: 0, food: 0, digital: 0, shopping: 0, misc: 0 };
  for (const q of questions) {
    const a = answers[q.id];
    if (!a) continue;
    acc[q.cat] += a.value * (cf[q.cat] ?? 1);
  }
  return acc;
}

(function runDevTests() {
  try {
    const qs = [
      { id: "q1", cat: "transport", options: [{ value: 0.1 }, { value: 0.2 }] },
      { id: "q2", cat: "housing", options: [{ value: 0.05 }, { value: 0.1 }] },
    ];
    const ans = { q1: { value: 0.1 }, q2: { value: 0.05 } };
    const outUS = computeBreakdown(ans, qs, "US");
    console.assert(Math.abs(outUS.transport - 0.1 * countryFactors.US.transport) < 1e-9, "transport factor");
    console.assert(Math.abs(outUS.housing - 0.05 * countryFactors.US.housing) < 1e-9, "housing factor");
    const total = Object.values(outUS).reduce((s, v) => s + v, 0);
    console.assert(total > 0.1 && total < 0.3, "total in expected range");
  } catch (e) {
    /* no-op */
  }
})();

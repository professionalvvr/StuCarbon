import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CarbonFootprint } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Loader2 } from "lucide-react";

// Lazy load components to reduce initial bundle size
const WelcomeScreen = React.lazy(() => import("../components/calculator/WelcomeScreen"));
const GradeSelector = React.lazy(() => import("../components/calculator/GradeSelector"));
const QuestionCard = React.lazy(() => import("../components/calculator/QuestionCard"));
const LoadingScreen = React.lazy(() => import("../components/calculator/LoadingScreen"));
const CarbonMountain = React.lazy(() => import("../components/calculator/CarbonMountain"));

// A single, comprehensive question set
const questions = {
  middle_school: [
    // Core
    { id: "commute_method", title: "How do you usually get to school? 🚌", options: [{ value: "walk_bike", label: "Walk or Bicycle", emoji: "🚲" }, { value: "school_bus", label: "School Bus", emoji: "🚌" }, { value: "parent_car", label: "Parent's Car", emoji: "🚗" }] },
    { id: "ac_heater_usage", title: "Does your family use air conditioning or a heater at home? ❄️", options: [{ value: "rare", label: "Rarely", emoji: "👍" }, { value: "sometimes", label: "Sometimes", emoji: "🤔" }, { value: "often", label: "Often", emoji: "🔥" }] },
    { id: "meals_source", title: "What are your meals usually like? 🥪", options: [{ value: "home_cooked", label: "Home-cooked", emoji: "🏡" }, { value: "mixed", label: "Mix of home and eating out", emoji: "🥡" }, { value: "eat_out", label: "Mostly eating out", emoji: "🍕" }] },
    { id: "screen_time", title: "How much time do you spend on screens daily for YouTube, games, and entertainment? 📱", options: [{ value: "0_hours", label: "0 hours", emoji: "🧘" }, { value: "under_2_hours", label: "1 to 2 hours", emoji: "😊" }, { value: "2_4_hours", label: "2 to 4 hours", emoji: "💻" }, { value: "5_plus_hours", label: "5 or more hours", emoji: "🤯" }] },
    { id: "flights_per_year", title: "How often does your family fly per year? ✈️", options: [{ value: "none", label: "None", emoji: "🌱" }, { value: "1_2_domestic", label: "1 to 2 domestic trips", emoji: "🛫" }, { value: "1_plus_international", label: "1 or more international trips", emoji: "🌍" }] },
    { id: "recycling_habits", title: "Does your family recycle? ♻️", options: [{ value: "always", label: "Always", emoji: "🌟" }, { value: "sometimes", label: "Sometimes", emoji: "👍" }, { value: "never", label: "Never", emoji: "😅" }] },
    // Detailed & Micro
    { id: "shower_time", title: "How long are your average showers? 🚿", options: [{ value: "under_5_min", label: "Under 5 minutes", emoji: "⚡" }, { value: "5_10_min", label: "5 to 10 minutes", emoji: "🕐" }, { value: "over_10_min", label: "Over 10 minutes", emoji: "🛁" }] },
    { id: "food_waste", title: "How much food do you throw away each week? 🗑️", options: [{ value: "almost_none", label: "Almost none", emoji: "🌟" }, { value: "small_amount", label: "A small amount", emoji: "👍" }, { value: "moderate_amount", label: "A moderate amount", emoji: "😕" }, { value: "a_lot", label: "A lot", emoji: "😰" }] },
    { id: "second_hand_buying", title: "When getting new stuff, how often do you choose second-hand items? 👕", options: [{ value: "always_often", label: "Always or Often", emoji: "♻️" }, { value: "sometimes", label: "Sometimes", emoji: "👍" }, { value: "rarely_never", label: "Rarely or Never", emoji: "🛍️" }] },
  ],
  high_school: [
    // Core
    { id: "commute_method", title: "How do you usually get to school? 🛵", options: [{ value: "walk_bike", label: "Walk or Bicycle", emoji: "🚲" }, { value: "public_transport", label: "Bus or Train", emoji: "🚌" }, { value: "two_wheeler", label: "Two-Wheeler", emoji: "🛵" }, { value: "parent_car", label: "Parent's Car", emoji: "🚗" }, { value: "rideshare", label: "Rideshare", emoji: "🚖" }] },
    { id: "commute_distance", title: "What is the one-way distance to your school? 📏", options: [{ value: "under_2km", label: "Less than 2 kilometers" }, { value: "2_5km", label: "2 to 5 kilometers" }, { value: "5_10km", label: "5 to 10 kilometers" }, { value: "over_10km", label: "10 or more kilometers" }] },
    { id: "meals_source", title: "Where do you usually eat lunch? 🍔", options: [{ value: "from_home", label: "From Home", emoji: "🍱" }, { value: "canteen", label: "School Canteen", emoji: "🏫" }, { value: "food_delivery", label: "Food Delivery like Zomato", emoji: "🥡" }] },
    { id: "screen_time", title: "How much time do you spend daily on digital activities like social media and streaming? 🎧", options: [{ value: "0_hours", label: "0 hours", emoji: "🧘" }, { value: "0_2_hours", label: "1 to 2 hours" }, { value: "3_6_hours", label: "3 to 6 hours" }, { value: "7_plus_hours", label: "7 or more hours" }] },
    { id: "shopping_frequency", title: "How often do you shop for new items like fashion or gadgets? 🛍️", options: [{ value: "rarely", label: "Rarely", emoji: "✨" }, { value: "occasionally", label: "Occasionally", emoji: "🛒" }, { value: "frequently", label: "Frequently", emoji: "💸" }] },
    { id: "flights_per_year", title: "How often do you fly per year? ✈️", options: [{ value: "none", label: "None" }, { value: "1_2_domestic", label: "1 to 2 domestic trips" }, { value: "1_plus_international", label: "1 or more international trips" }] },
    { id: "recycling_habits", title: "How are your recycling habits? ♻️", options: [{ value: "always", label: "Always" }, { value: "sometimes", label: "Sometimes" }, { value: "never", label: "Never" }] },
    // Detailed & Micro
    { id: "unplug_electronics", title: "How often do you unplug electronics when not in use? 🔌", options: [{ value: "always", label: "Always", emoji: "🌟" }, { value: "sometimes", label: "Sometimes", emoji: "👍" }, { value: "rarely", label: "Rarely", emoji: "😅" }] },
    { id: "shower_time", title: "How long are your average showers? 🚿", options: [{ value: "under_5_min", label: "Under 5 minutes", emoji: "⚡" }, { value: "5_10_min", label: "5 to 10 minutes", emoji: "🕐" }, { value: "over_10_min", label: "Over 10 minutes", emoji: "🛁" }] },
    { id: "single_use_items", title: "How often do you use single-use items like bottled water or disposable cups? 🥤", options: [{ value: "rarely", label: "Rarely", emoji: "♻️" }, { value: "sometimes", label: "Sometimes", emoji: "🤔" }, { value: "often", label: "Often", emoji: "🗑️" }] },
    { id: "food_waste", title: "How much food do you throw away each week? 🗑️", options: [{ value: "almost_none", label: "Almost none", emoji: "🌟" }, { value: "small_amount", label: "A small amount", emoji: "👍" }, { value: "moderate_amount", label: "A moderate amount", emoji: "😕" }, { value: "a_lot", label: "A lot", emoji: "😰" }] },
    { id: "second_hand_buying", title: "When buying clothes or gadgets, how often do you choose second-hand items? 👕", options: [{ value: "always_often", label: "Always or Often", emoji: "♻️" }, { value: "sometimes", label: "Sometimes", emoji: "👍" }, { value: "rarely_never", label: "Rarely or Never", emoji: "🛍️" }] },
  ],
  college: [
    // Core
    { id: "housing_type", title: "Where do you currently live? 🏨", options: [{ value: "hostel", label: "Hostel or Dorm" }, { value: "shared_flat", label: "Off-campus Flat" }, { value: "family_home", label: "With Parents" }] },
    { id: "ac_heater_usage", title: "How often do you use air conditioning or heater in your room? ❄️", options: [{ value: "rare", label: "Rarely" }, { value: "few_hrs_daily", label: "Few hours daily" }, { value: "long_daily_use", label: "Long daily use" }] },
    { id: "commute_method", title: "How do you commute to campus? 🚶‍♀️", options: [{ value: "walk_bike", label: "Walk or Bicycle", emoji: "🚲" }, { value: "campus_shuttle", label: "Campus Shuttle", emoji: "🚌" }, { value: "public_transport", label: "Public Transport", emoji: "🚌" }, { value: "two_wheeler", label: "Two-Wheeler", emoji: "🛵" }, { value: "car", label: "Car", emoji: "🚗" }, { value: "rideshare", label: "Rideshare", emoji: "🚖" }] },
    { id: "commute_distance", title: "What is the one-way distance to your campus? 📏", options: [{ value: "under_2km", label: "Less than 2 kilometers" }, { value: "2_5km", label: "2 to 5 kilometers" }, { value: "5_10km", label: "5 to 10 kilometers" }, { value: "over_10km", label: "10 or more kilometers" }] },
    { id: "diet_type", title: "What is your typical diet? 🍽️", options: [{ value: "vegetarian", label: "Vegetarian" }, { value: "mixed", label: "Mixed with occasional meat" }, { value: "meat_heavy", label: "Meat-heavy with daily meat" }] },
    { id: "meals_source", title: "Where do your meals come from? 🍕", options: [{ value: "cooking", label: "I cook" }, { value: "campus_cafeteria", label: "Campus Cafeteria" }, { value: "food_delivery", label: "Food Delivery" }] },
    { id: "screen_time", title: "How much time do you spend daily on digital activities? 💻", options: [{ value: "0_hours", label: "0 hours", emoji: "🧘" }, { value: "3_6_hours", label: "3 to 6 hours" }, { value: "7_plus_hours", label: "7 or more hours" }] },
    { id: "shopping_frequency", title: "How often do you shop for new clothes or gadgets? 🛍️", options: [{ value: "rarely", label: "Rarely" }, { value: "occasionally", label: "Occasionally" }, { value: "frequently", label: "Frequently" }] },
    { id: "flights_per_year", title: "How many flights do you take per year? ✈️", options: [{ value: "none", label: "None" }, { value: "1_2_domestic", label: "1 to 2 domestic trips" }, { value: "1_plus_international", label: "1 or more international trips" }] },
    { id: "recycling_habits", title: "How are your recycling habits? ♻️", options: [{ value: "always", label: "Always" }, { value: "sometimes", label: "Sometimes" }, { value: "never", label: "Never" }] },
    // Detailed & Micro
    { id: "unplug_electronics", title: "How often do you unplug electronics when not in use? 🔌", options: [{ value: "always", label: "Always", emoji: "🌟" }, { value: "sometimes", label: "Sometimes", emoji: "👍" }, { value: "rarely", label: "Rarely", emoji: "😅" }] },
    { id: "shower_time", title: "How long are your average showers? 🚿", options: [{ value: "under_5_min", label: "Under 5 minutes", emoji: "⚡" }, { value: "5_10_min", label: "5 to 10 minutes", emoji: "🕐" }, { value: "over_10_min", label: "Over 10 minutes", emoji: "🛁" }] },
    { id: "single_use_items", title: "How often do you use single-use items like bottled water or disposable cups? 🥤", options: [{ value: "rarely", label: "Rarely", emoji: "♻️" }, { value: "sometimes", label: "Sometimes", emoji: "🤔" }, { value: "often", label: "Often", emoji: "🗑️" }] },
    { id: "food_waste", title: "How much food do you throw away each week? 🗑️", options: [{ value: "almost_none", label: "Almost none", emoji: "🌟" }, { value: "small_amount", label: "A small amount", emoji: "👍" }, { value: "moderate_amount", label: "A moderate amount", emoji: "😕" }, { value: "a_lot", label: "A lot", emoji: "😰" }] },
    { id: "second_hand_buying", title: "When buying clothes or gadgets, how often do you choose second-hand items? 👕", options: [{ value: "always_often", label: "Always or Often", emoji: "♻️" }, { value: "sometimes", label: "Sometimes", emoji: "👍" }, { value: "rarely_never", label: "Rarely or Never", emoji: "🛍️" }] },
    { id: "computer_shutdown", title: "How often do you turn off your computer or laptop overnight? 💻", options: [{ value: "always", label: "Always", emoji: "🌙" }, { value: "sometimes", label: "Sometimes", emoji: "🤔" }, { value: "rarely", label: "Rarely", emoji: "💡" }] },
    { id: "laundry_habits", title: "What water temperature do you use for laundry? 👕", options: [{ value: "mostly_cold", label: "Mostly Cold", emoji: "❄️" }, { value: "mixed_warm", label: "Mixed or Warm", emoji: "💧" }, { value: "mostly_hot", label: "Mostly Hot", emoji: "🔥" }] },
    { id: "holiday_travel", title: "For holidays, how do you usually travel long distance? 🏖️", options: [{ value: "none", label: "I do not travel long distance", emoji: "🏡" }, { value: "bus_train", label: "Bus or Train", emoji: "🚆" }, { value: "short_flight", label: "Domestic Flight", emoji: "🛫" }] },
    { id: "food_sourcing", title: "Where does your food mostly come from? 🥕", options: [{ value: "mostly_local", label: "Farmer's Markets or Local", emoji: "🧑‍🌾" }, { value: "mixed", label: "A Mix", emoji: "🤔" }, { value: "mostly_supermarket", label: "Large Supermarkets", emoji: "🛒" }] },
  ]
};

// Simple loading fallback component
const ComponentLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
  </div>
);

export default function CalculatorPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0=welcome, 1=grade, 2+=questions, last=loading
  const [userGrade, setUserGrade] = useState(null);
  const [answers, setAnswers] = useState({});
  const [country, setCountry] = useState(null);
  const [isDetectingCountry, setIsDetectingCountry] = useState(true);
  const [currentEmissions, setCurrentEmissions] = useState(0);

  // --- Sound Effect Logic ---
  const createImpactSound = () => {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a "thud" sound - like something heavy landing on a pile
        const thud = audioContext.createOscillator();
        const thudGain = audioContext.createGain();
        thud.connect(thudGain);
        thudGain.connect(audioContext.destination);
        thud.type = 'sawtooth'; // Rougher sound
        thud.frequency.setValueAtTime(45, audioContext.currentTime); // Very low frequency
        thudGain.gain.setValueAtTime(0.09, audioContext.currentTime); // Increased volume by ~15%
        thudGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
        thud.start(audioContext.currentTime);
        thud.stop(audioContext.currentTime + 0.3);

        // Create crinkly/rustling sound - like plastic bags and papers shifting
        const bufferSize = audioContext.sampleRate * 0.4; // Longer crinkle
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        // Create filtered noise that sounds more like crinkly materials
        for (let i = 0; i < bufferSize; i++) {
          const noise = (Math.random() * 2 - 1);
          // Apply some filtering to make it sound more like crinkly materials
          output[i] = noise * (1 - i / bufferSize) * Math.sin(i * 0.01);
        }
        
        const crinkle = audioContext.createBufferSource();
        crinkle.buffer = noiseBuffer;
        const crinkleGain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        crinkle.connect(filter);
        filter.connect(crinkleGain);
        crinkleGain.connect(audioContext.destination);
        
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(800, audioContext.currentTime); // Filter for crinkly high frequencies
        
        crinkleGain.gain.setValueAtTime(0.06, audioContext.currentTime); // Increased volume by ~15%
        crinkleGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
        
        crinkle.start(audioContext.currentTime + 0.05); // Start slightly after the thud
        crinkle.stop(audioContext.currentTime + 0.4);

        // Add a small "settling" sound - like things shifting in the pile
        const settle = audioContext.createOscillator();
        const settleGain = audioContext.createGain();
        settle.connect(settleGain);
        settleGain.connect(audioContext.destination);
        settle.type = 'triangle';
        settle.frequency.setValueAtTime(200, audioContext.currentTime + 0.2); // Mid frequency
        settle.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.5); // Falling pitch
        settleGain.gain.setValueAtTime(0.035, audioContext.currentTime + 0.2); // Increased volume by ~15%
        settleGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        settle.start(audioContext.currentTime + 0.2);
        settle.stop(audioContext.currentTime + 0.5);

      } catch (error) {
        console.error('Audio could not be played:', error);
      }
    }
  };
  
  const prevEmissions = useRef(0);
  // --- End Sound Effect Logic ---

  useEffect(() => {
    detectCountry();
  }, []);

  // Update emissions in real-time as answers change
  useEffect(() => {
    if (userGrade && Object.keys(answers).length > 0) {
      const emissions = calculateEmissions(answers, country?.code, userGrade);
      setCurrentEmissions(emissions);
    } else {
        setCurrentEmissions(0); // Reset when not in the quiz flow or no answers yet
    }
  }, [answers, userGrade, country]);

  // Effect to play sound on mountain growth
  const currentQuestions = userGrade ? questions[userGrade] : []; // Define currentQuestions here for use in useEffect
  useEffect(() => {
    // Play sound only if the quiz has started and emissions have actually increased
    if (currentStep >= 2 && currentStep < currentQuestions.length + 2 && currentEmissions > prevEmissions.current) {
      createImpactSound();
    }
    // Update the previous emissions value for the next render
    prevEmissions.current = currentEmissions;
  }, [currentEmissions, currentStep, currentQuestions.length]);

  const getFlagEmoji = (countryCode) => {
    if (!countryCode || countryCode.length !== 2) return '🌍'; // Default globe emoji
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  };

  const detectCountry = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setCountry({
        name: data.country_name,
        code: data.country_code
      });
    } catch (error) {
      console.error('Country detection failed:', error);
      setCountry({ name: 'Global', code: 'GLOBAL' });
    }
    setIsDetectingCountry(false);
  };

  const handleGradeSelect = (grade) => {
    setUserGrade(grade);
    setCurrentStep(2);
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = () => {
    if (currentStep === currentQuestions.length + 1) {
      calculateFootprint();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  // Calculate mountain progress to ensure it grows until the end
  const getMountainProgress = () => {
    if (currentStep <= 1 || !userGrade) return 0;
    
    const totalQuestions = currentQuestions.length;
    const questionsAnswered = Object.keys(answers).length;
    
    if (questionsAnswered === 0) return 0;
    
    // A smaller baseline progress from question completion
    const questionProgress = (questionsAnswered / totalQuestions) * 20;
    
    // Emission-based progress with a higher cap to allow for more growth
    const visualMaxEmissions = 25;
    const cappedEmissions = Math.min(currentEmissions, visualMaxEmissions);
    const emissionProgress = (cappedEmissions / visualMaxEmissions) * 80;
    
    const calculatedProgress = questionProgress + emissionProgress;

    // A minimum floor that increases with each question, guaranteeing visible growth.
    const minimumProgress = 5 + (questionsAnswered * 2);

    // Take the higher of the calculated progress or the minimum guaranteed progress
    return Math.min(Math.max(calculatedProgress, minimumProgress), 100);
  };

  const calculateFootprint = async () => {
    setCurrentStep(currentQuestions.length + 2);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { totalEmissions, breakdown } = calculateFootprintData(answers, country?.code, userGrade);

    const result = await CarbonFootprint.create({
      country: country?.name || 'Global',
      user_grade: userGrade,
      ...answers,
      total_emissions: totalEmissions,
      breakdown: breakdown,
    });

    navigate(`${createPageUrl("Results")}?id=${result.id}`);
  };

  // Re-calculating in real-time for the header display
  const calculateEmissions = (answers, countryCode, grade) => {
    const { totalEmissions } = calculateFootprintData(answers, countryCode, grade);
    return totalEmissions;
  }

  const calculateFootprintData = (answers, countryCode, grade) => {
    // Emission factors are in tons of CO2e per year for the selected option.
    // Sources: IPCC, IEA, EPA, Our World in Data, academic studies on consumption footprints.
    // These are simplified averages for a student-focused model.
    const emissionFactors = {
      housing: {
        base: { middle_school: 0.4, high_school: 0.6, college: 0.8 }, // Base energy use for living
        college_living: { hostel: { IN: 0.3, US: 0.6, GB: 0.4, AU: 0.5, GLOBAL: 0.4 }, family_home: { IN: 0, US: 0, GB: 0, AU: 0, GLOBAL: 0 }, shared_flat: { IN: 0.4, US: 0.8, GB: 0.5, AU: 0.6, GLOBAL: 0.6 } },
        acHeater: { none: 0, rare: 0.05, sometimes: { IN: 0.25, US: 0.5, GB: 0.3, AU: 0.4, GLOBAL: 0.35 }, often: { IN: 0.5, US: 1.0, GB: 0.6, AU: 0.8, GLOBAL: 0.7 }, few_hrs_daily: { IN: 0.4, US: 0.8, GB: 0.5, AU: 0.6, GLOBAL: 0.6 }, long_daily_use: { IN: 0.8, US: 1.6, GB: 1.0, AU: 1.2, GLOBAL: 1.1 } },
        shower_time: { under_5_min: -0.1, '5_10_min': 0, over_10_min: 0.15 },
        laundry_habits: { mostly_cold: -0.05, mixed_warm: 0, mostly_hot: 0.08 },
        unplug_electronics: { always: -0.1, sometimes: -0.05, rarely: 0.05 },
      },
      transport: {
        commute: { walk_bike: 0, school_bus: 0.15, parent_car: 0.5, public_transport: 0.25, two_wheeler: 0.35, car: 1.0, rideshare: 0.4, campus_shuttle: 0.1 },
        distance_multiplier: { under_2km: 0.6, "2_5km": 1.0, "5_10km": 1.5, over_10km: 2.5 },
        flights: { none: 0, "1_2_domestic": 0.6, "1_plus_international": 2.0 },
        holiday_travel: { none: 0, bus_train: 0.15, short_flight: 0.4 },
      },
      food: {
        diet: { vegetarian: { IN: 0.5, US: 0.8, GB: 0.7, AU: 0.7, GLOBAL: 0.7 }, mixed: { IN: 0.9, US: 1.5, GB: 1.2, AU: 1.4, GLOBAL: 1.2 }, meat_heavy: { IN: 1.3, US: 2.2, GB: 1.8, AU: 2.0, GLOBAL: 1.8 } },
        meals: { home_cooked: 0.1, canteen: 0.25, food_delivery: 0.5, cooking: 0.15, campus_cafeteria: 0.3, eat_out: 0.4, mixed: 0.2, from_home: 0.1 }, // Added from_home for high_school
        food_waste: { almost_none: -0.1, small_amount: 0, moderate_amount: 0.1, a_lot: 0.2 },
        food_sourcing: { mostly_local: -0.08, mixed: 0, mostly_supermarket: 0.05 },
      },
      digital: {
        screen_time: { "0_hours": 0.02, "under_2_hours": 0.04, "2_4_hours": 0.08, "5_plus_hours": 0.15, "0_2_hours": 0.06, "3_6_hours": 0.2, "7_plus_hours": 0.35 },
        computer_shutdown: { always: -0.04, sometimes: 0, rarely: 0.04 },
      },
      shopping: {
        frequency: { rarely: 0.15, occasionally: 0.4, frequently: 0.9 },
        second_hand_buying: { always_often: -0.2, sometimes: -0.05, rarely_never: 0.1 },
      },
      misc: {
        single_use_items: { rarely: -0.08, sometimes: 0, often: 0.1 },
      }
    };

    const getCountryFactor = (factors, country = 'GLOBAL') => {
      if (typeof factors === 'object' && !Array.isArray(factors) && factors !== null) {
        // Prefer specific country, then GLOBAL, then the first value in the object, otherwise 0
        return factors[country] ?? factors.GLOBAL ?? (Object.values(factors)[0] || 0);
      }
      return factors || 0; // If not an object (e.g., a direct number), return it directly
    };
    
    let breakdown = { housing: 0, transport: 0, food: 0, digital: 0, shopping: 0, misc: 0 };

    // --- HOUSING ---
    breakdown.housing += emissionFactors.housing.base[grade] || 0;
    if (grade === 'college' && answers.housing_type) {
      breakdown.housing += getCountryFactor(emissionFactors.housing.college_living[answers.housing_type], countryCode);
    }
    if (answers.ac_heater_usage) {
      breakdown.housing += getCountryFactor(emissionFactors.housing.acHeater[answers.ac_heater_usage], countryCode);
    }
    if (answers.shower_time) breakdown.housing += emissionFactors.housing.shower_time[answers.shower_time] || 0;
    if (answers.laundry_habits) breakdown.housing += emissionFactors.housing.laundry_habits[answers.laundry_habits] || 0;
    if (answers.unplug_electronics) breakdown.housing += emissionFactors.housing.unplug_electronics[answers.unplug_electronics] || 0;

    // --- TRANSPORT ---
    if (answers.commute_method) {
        let transportBase = emissionFactors.transport.commute[answers.commute_method] || 0;
        let multiplier = answers.commute_distance ? emissionFactors.transport.distance_multiplier[answers.commute_distance] : 1;
        breakdown.transport += transportBase * multiplier;
    }
    if (answers.flights_per_year) breakdown.transport += emissionFactors.transport.flights[answers.flights_per_year] || 0;
    if (answers.holiday_travel) breakdown.transport += emissionFactors.transport.holiday_travel[answers.holiday_travel] || 0;

    // --- FOOD ---
    if (answers.diet_type) {
      breakdown.food += getCountryFactor(emissionFactors.food.diet[answers.diet_type], countryCode);
    } else if (grade !== 'college') { // Default assumption for younger students who don't have diet_type question
      breakdown.food += getCountryFactor(emissionFactors.food.diet['mixed'], countryCode) * 0.7; 
    }
    if (answers.meals_source) breakdown.food += emissionFactors.food.meals[answers.meals_source] || 0;
    if (answers.food_waste) breakdown.food += emissionFactors.food.food_waste[answers.food_waste] || 0;
    if (answers.food_sourcing) breakdown.food += emissionFactors.food.food_sourcing[answers.food_sourcing] || 0;
    
    // --- DIGITAL ---
    if (answers.screen_time) breakdown.digital += emissionFactors.digital.screen_time[answers.screen_time] || 0;
    if (answers.computer_shutdown) breakdown.digital += emissionFactors.digital.computer_shutdown[answers.computer_shutdown] || 0;

    // --- SHOPPING ---
    if (answers.shopping_frequency) breakdown.shopping += emissionFactors.shopping.frequency[answers.shopping_frequency] || 0;
    if (answers.second_hand_buying) breakdown.shopping += emissionFactors.shopping.second_hand_buying[answers.second_hand_buying] || 0;
    
    // --- MISC ---
    if (answers.single_use_items) breakdown.misc += emissionFactors.misc.single_use_items[answers.single_use_items] || 0;
    
    // Proportional reduction for recycling, applied to all categories
    let recyclingMultiplier = 1;
    if (answers.recycling_habits === 'always') recyclingMultiplier = 0.95; // 5% reduction
    else if (answers.recycling_habits === 'sometimes') recyclingMultiplier = 0.98; // 2% reduction
    
    Object.keys(breakdown).forEach(key => { breakdown[key] *= recyclingMultiplier; });
    
    // Sum up and round
    const totalEmissions = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    Object.keys(breakdown).forEach(key => { breakdown[key] = Math.max(0, parseFloat(breakdown[key].toFixed(2))); });

    return {
        totalEmissions: Math.max(0.5, parseFloat(totalEmissions.toFixed(2))), // Ensure a minimum total value
        breakdown
    };
  };

  if (isDetectingCountry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-600">Detecting your location...</p>
        </div>
      </div>
    );
  }

  // Show mountain background only during quiz questions (steps 2 to before loading screen)
  const showMountain = currentStep >= 2 && currentStep < currentQuestions.length + 2;

  if (currentStep === 0) {
    return (
      <React.Suspense fallback={<ComponentLoader />}>
        <WelcomeScreen onStart={() => setCurrentStep(1)} />
      </React.Suspense>
    );
  }
  
  if (currentStep === 1) {
    return (
      <React.Suspense fallback={<ComponentLoader />}>
        <GradeSelector onSelect={handleGradeSelect} />
      </React.Suspense>
    );
  }

  if (currentStep === currentQuestions.length + 2) {
    return (
      <React.Suspense fallback={<ComponentLoader />}>
        <LoadingScreen />
      </React.Suspense>
    );
  }

  const currentQuestion = currentQuestions[currentStep - 2]; 
  const progress = ((currentStep - 2) / currentQuestions.length) * 100;

  if (!currentQuestion) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <p className="text-gray-600">Loading questions...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen py-8 px-4 relative">
      <div className="max-w-2xl mx-auto relative">
        
        {/* UI Layer */}
        <div className="relative z-20">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentStep - 1} of {currentQuestions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            {country?.name && (
                <p className="text-xs text-gray-500 text-right mt-1">
                    Using <span className="font-semibold">{country.name}</span> emission data <span className="text-xl inline-block align-middle ml-1">{getFlagEmoji(country.code)}</span>
                </p>
            )}
            
            {currentEmissions > 0 && (
              <div className="mt-3 text-center">
                <div className="inline-block bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border">
                  <span className="text-sm font-medium text-slate-700">
                    Current footprint: <span className="font-bold text-rose-600">{currentEmissions.toFixed(2)} tons CO₂/year</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <React.Suspense fallback={<ComponentLoader />}>
            <QuestionCard
              question={currentQuestion}
              selectedValue={answers[currentQuestion.id]}
              onSelect={(value) => handleAnswer(currentQuestion.id, value)}
              onNext={nextStep}
              onPrev={prevStep}
              canGoNext={!!answers[currentQuestion.id]}
              isFirstQuestion={currentStep === 2}
              country={country}
            />
          </React.Suspense>
        </div>

        {/* Mountain Visual Layer (top layer - overlays everything) */}
        {showMountain && (
          <React.Suspense fallback={null}>
            <CarbonMountain 
              progress={getMountainProgress()} 
            />
          </React.Suspense>
        )}
      </div>
    </div>
  );
}
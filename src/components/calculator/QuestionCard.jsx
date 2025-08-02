
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

export default function QuestionCard({ 
  question, 
  selectedValue, 
  onSelect, 
  onNext, 
  onPrev, 
  canGoNext, 
  isFirstQuestion,
  country 
}) {
  const getFlagEmoji = (countryCode) => {
    if (!countryCode || countryCode.length !== 2) return '🌍';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
      {/* Subtle student-themed background pattern */}
      <div className="absolute top-4 left-4 w-12 h-12 opacity-5">
        <BookOpen className="w-full h-full text-emerald-600" />
      </div>
      
      <CardHeader className="text-center pb-6 relative">
        {/* Country Flag Display */}
        {country && (
          <div className="absolute top-4 right-4 flex items-center gap-2 text-sm text-slate-600 bg-white/80 px-3 py-1 rounded-full shadow-sm">
            <span>Your Location:</span>
            <span className="text-lg">{getFlagEmoji(country.code)}</span>
          </div>
        )}
        
        <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed pt-8 sm:pt-4">
          {question.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
              selectedValue === option.value
                ? 'border-emerald-400 bg-emerald-50 shadow-md transform scale-[1.02]'
                : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-xl sm:text-2xl">{option.emoji}</span>
              <div>
                <p className="font-medium text-slate-800 text-base sm:text-lg">{option.label}</p>
              </div>
            </div>
          </button>
        ))}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 sm:pt-6">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={isFirstQuestion}
            className="flex items-center gap-2 border-stone-300 text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center gap-2 shadow-lg"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

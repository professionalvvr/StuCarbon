
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Leaf, Calculator, BarChart3, GraduationCap, BookOpen } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 relative">
      {/* Student-themed background elements */}
      <div className="absolute top-32 left-20 opacity-5">
        <GraduationCap className="w-24 h-24 text-emerald-400" />
      </div>
      <div className="absolute bottom-32 right-20 opacity-5">
        <BookOpen className="w-20 h-20 text-teal-400" />
      </div>
      
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl max-w-md w-full relative z-10">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg relative">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <GraduationCap className="w-3 h-3 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Calculating your student footprint...
            </h2>
            <p className="text-slate-600">
              Crunching the numbers with real emission data 🎓
            </p>
          </div>

          {/* Fun Loading Messages */}
          <div className="space-y-4 text-sm text-slate-500">
            <div className="flex items-center justify-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>Analyzing your student lifestyle choices...</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Comparing with global student data...</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Leaf className="w-4 h-4" />
              <span>Preparing personalized student tips...</span>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

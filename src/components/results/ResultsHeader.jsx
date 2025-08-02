
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TreePine, Share2, GraduationCap, Award } from "lucide-react";

export default function ResultsHeader({ 
  totalEmissions, 
  treeEquivalent, 
  onShare 
}) {
  const averageStudentEmissions = 3.5;
  const visualMaxEmissions = 15;
  const mountainHeight = Math.min((totalEmissions / visualMaxEmissions) * 100, 100);
  const averageMountainHeight = Math.min((averageStudentEmissions / visualMaxEmissions) * 100, 100);

  return (
    <Card className="bg-gradient-to-r from-red-50 via-gray-50 to-amber-50 border-0 shadow-xl mb-6 sm:mb-8 relative overflow-hidden">
      
      <CardContent className="p-6 sm:p-8 text-center relative z-10">
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-8 h-8 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-700">Student Carbon Assessment Complete!</h2>
          </div>
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 mb-2">
            {totalEmissions.toFixed(2)}
            <span className="text-lg sm:text-xl md:text-2xl text-slate-600 ml-2">tons CO₂/year</span>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-slate-600">Your Carbon Mountain Complete!</p>
        </div>

        {/* Visual mountain comparison */}
        <div className="my-6 bg-white/60 rounded-2xl p-4 border border-stone-200">
          <div className="flex items-end justify-center gap-8 h-24">
            {/* User's mountain */}
            <div className="text-center">
              <div 
                className="bg-gradient-to-t from-rose-700 to-rose-500 rounded-t-lg mx-auto mb-2 transition-all duration-500"
                style={{ 
                  width: '40px', 
                  height: `${Math.max(mountainHeight, 20)}px`,
                }}
              />
              <span className="text-xs font-medium text-rose-700">Your Mountain</span>
            </div>
            
            {/* Average mountain for comparison */}
            <div className="text-center">
              <div 
                className="bg-gradient-to-t from-slate-400 to-slate-300 rounded-t-lg mx-auto mb-2"
                style={{ 
                  width: '40px', 
                  height: `${Math.max(averageMountainHeight, 20)}px`,
                }}
              />
              <span className="text-xs font-medium text-slate-600">Average Student</span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
            <div className="bg-white/80 rounded-2xl p-4 sm:p-6 shadow-md border border-stone-100 max-w-xs">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
                <TreePine className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                <span className="text-2xl sm:text-3xl font-bold text-emerald-700">
                    {treeEquivalent.toLocaleString()}
                </span>
                </div>
                <p className="text-sm sm:text-base text-slate-600">trees needed to offset this annually</p>
            </div>
        </div>

        <Button
          onClick={onShare}
          variant="outline"
          className="mx-auto border-stone-300 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <GraduationCap className="w-4 h-4" />
          Share Your Student Results
        </Button>
      </CardContent>
    </Card>
  );
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Users } from "lucide-react";

export default function ComparisonBar({ totalEmissions }) {
  const globalAverage = 3.5;
  const climateTarget = 2.0;
  const maxValue = Math.max(totalEmissions, globalAverage, climateTarget) + 1;

  const getPercentage = (value) => (value / maxValue) * 100;

  const getStatusColor = () => {
    if (totalEmissions <= climateTarget) return "text-emerald-600";
    if (totalEmissions <= globalAverage) return "text-amber-600";
    return "text-rose-600";
  };

  const getStatusMessage = () => {
    if (totalEmissions <= climateTarget) return "Excellent! You're within climate targets 🌟";
    if (totalEmissions <= globalAverage) return "Good! Below average but room for improvement 👍";
    return "Above average - let's work on reducing it! 💪";
  };

  return (
    <Card className="shadow-lg border border-stone-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          <span className="text-slate-800">How do you compare?</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Climate Target */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-slate-700">Climate Target</span>
              </div>
              <span className="font-bold text-emerald-700">{climateTarget} tons</span>
            </div>
            <Progress value={getPercentage(climateTarget)} className="h-2" />
          </div>

          {/* Global Average */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-slate-700">Global Student Average</span>
              </div>
              <span className="font-bold text-amber-700">{globalAverage} tons</span>
            </div>
            <Progress value={getPercentage(globalAverage)} className="h-2" />
          </div>

          {/* Your Result */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-rose-500 to-red-600 rounded-full"></div>
                <span className="font-medium text-slate-700">Your Footprint</span>
              </div>
              <span className={`font-bold ${getStatusColor()}`}>{totalEmissions} tons</span>
            </div>
            <Progress value={getPercentage(totalEmissions)} className="h-3" />
          </div>
        </div>

        <div className={`text-center p-4 rounded-lg bg-stone-50 border border-stone-200 ${getStatusColor()}`}>
          <p className="font-medium">{getStatusMessage()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
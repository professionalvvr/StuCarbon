import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingDown, PartyPopper } from "lucide-react";

export default function ActionableTips({ footprint }) {
  const { breakdown, total_emissions, user_grade, ...answers } = footprint;

  const generateTips = () => {
    const allTips = [
        // Housing
        { condition: answers.ac_heater_usage === 'long_daily_use' || answers.ac_heater_usage === 'often', title: "Reduce AC/Heater Use", impact: 0.3, difficulty: "Medium", description: "Heating and cooling are major energy consumers. Try reducing use by an hour daily." },
        { condition: answers.shower_time === 'over_10_min', title: "Take Shorter Showers", impact: 0.2, difficulty: "Easy", description: "Heating water is energy-intensive. Aim for showers under 10 minutes." },
        { condition: answers.laundry_habits === 'mostly_hot', title: "Wash Laundry in Cold Water", impact: 0.1, difficulty: "Easy", description: "The vast majority of a washer's energy use is for heating water." },
        { condition: answers.unplug_electronics === 'rarely', title: "Unplug Electronics", impact: 0.1, difficulty: "Easy", description: "Unplug chargers and devices when not in use to stop 'phantom' power draw." },

        // Transport
        { condition: ['parent_car', 'car', 'rideshare'].includes(answers.commute_method), title: "Use Greener Commute Options", impact: 0.4, difficulty: "Medium", description: "Try public transport, carpooling, or biking once a week instead of driving." },
        { condition: answers.flights_per_year === '1_plus_international', title: "Reduce Air Travel", impact: 1.5, difficulty: "Hard", description: "Long-haul flights have a massive carbon footprint. Consider a domestic trip instead." },
        
        // Food
        { condition: answers.diet_type === 'meat_heavy', title: "Try 'Meat-Free Mondays'", impact: 0.4, difficulty: "Easy", description: "Reducing red meat intake is one of the most powerful climate actions you can take." },
        { condition: answers.food_waste === 'a_lot' || answers.food_waste === 'moderate_amount', title: "Reduce Food Waste", impact: 0.2, difficulty: "Medium", description: "Plan meals and store food properly to avoid waste, which has a high carbon footprint." },
        
        // Shopping & Misc
        { condition: answers.shopping_frequency === 'frequently', title: "Embrace 'Slow Fashion'", impact: 0.3, difficulty: "Hard", description: "Challenge consumer habits by trying a 'no-new-clothes' month or buying for longevity." },
        { condition: answers.second_hand_buying === 'rarely_never', title: "Choose Second-Hand First", impact: 0.25, difficulty: "Medium", description: "Extend the life of items and avoid emissions from new production by checking second-hand options first." },
        { condition: answers.single_use_items === 'often', title: "Ditch Single-Use Items", impact: 0.1, difficulty: "Easy", description: "Carry a reusable water bottle, coffee cup, and shopping bag to avoid disposable plastics." },
        
        // Digital
        { condition: answers.screen_time === '7_plus_hours' || answers.screen_time === '5_plus_hours', title: "Reduce Digital Consumption", impact: 0.1, difficulty: "Easy", description: "Reduce streaming quality from HD to SD or limit gaming time to save energy from data centers." },
        { condition: answers.computer_shutdown === 'rarely', title: "Shut Down Devices Overnight", impact: 0.05, difficulty: "Easy", description: "Shut down computers and game consoles completely to avoid standby power consumption." },

        // General good practice if they are not already doing it
        { condition: answers.recycling_habits === 'never' || answers.recycling_habits === 'sometimes', title: "Improve Recycling Habits", impact: 0.15, difficulty: "Easy", description: "Ensure you're recycling all eligible materials like paper, plastic, and glass to save energy." },
    ];

    const actionableTips = allTips.filter(tip => tip.condition);
    
    // Sort tips by impact, highest first
    actionableTips.sort((a, b) => b.impact - a.impact);

    return actionableTips.slice(0, 3);
  };

  const tips = generateTips();
  
  const potentialSavings = tips.reduce((sum, tip) => sum + tip.impact, 0);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Hard': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <Card className="shadow-lg border border-stone-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <span className="text-slate-800">Your Personalized Action Plan</span>
        </CardTitle>
        {tips.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-emerald-700">
                <TrendingDown className="w-4 h-4" />
                <span>Potential savings: {potentialSavings.toFixed(2)} tons/year</span>
            </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.length > 0 ? (
          tips.map((tip, index) => (
            <div key={index} className="p-4 bg-stone-50 rounded-lg border border-stone-200">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-slate-800">{tip.title}</h4>
                <Badge className={`${getDifficultyColor(tip.difficulty)} border`}>
                  {tip.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mb-2">{tip.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-emerald-700">💚 Save {tip.impact.toFixed(2)} tons/year</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-center gap-2 mb-2">
                <PartyPopper className="w-6 h-6 text-emerald-600" />
                <h4 className="font-semibold text-emerald-800 text-lg">Great Job!</h4>
            </div>
            <p className="text-sm text-emerald-700">Your habits are already quite sustainable. There are no immediate high-impact changes for you to make. Keep up the great work! 🌍</p>
          </div>
        )}

        {tips.length > 0 && (
            <div className="text-center pt-4 border-t border-stone-200">
            <p className="text-sm text-slate-600">
                By implementing these tips, you could reduce your footprint to{' '}
                <span className="font-bold text-emerald-700">
                {Math.max(0, total_emissions - potentialSavings).toFixed(2)} tons/year
                </span>
                !
            </p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
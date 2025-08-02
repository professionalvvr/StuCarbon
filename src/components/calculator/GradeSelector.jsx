
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, User, GraduationCap, BookOpen, Backpack } from "lucide-react";

const grades = [
  { value: "middle_school", label: "Middle School", subtext: "Grades 6–8", icon: Backpack },
  { value: "high_school", label: "High School", subtext: "Grades 9–12", icon: BookOpen },
  { value: "college", label: "College / University", subtext: "", icon: GraduationCap }
];

export default function GradeSelector({ onSelect }) {
  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Student-themed background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-10">
        <GraduationCap className="w-full h-full text-emerald-400" />
      </div>
      <div className="absolute bottom-20 right-10 w-40 h-40 opacity-10">
        <BookOpen className="w-full h-full text-teal-400" />
      </div>
      
      <div className="max-w-2xl mx-auto relative z-10">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed">
              What grade are you in? 🎓
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {grades.map((grade) => {
              const Icon = grade.icon;
              return (
                <button
                  key={grade.value}
                  onClick={() => onSelect(grade.value)}
                  className="w-full p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md border-stone-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-base sm:text-lg">{grade.label}</p>
                      {grade.subtext && <p className="text-sm text-slate-500">{grade.subtext}</p>}
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

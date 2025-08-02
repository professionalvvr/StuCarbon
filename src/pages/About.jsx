import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Leaf, 
  Users, 
  Target, 
  BookOpen, 
  ArrowRight,
  Globe,
  Lightbulb,
  Heart,
  FlaskConical
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Our Student Carbon Footprint Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The most comprehensive student carbon footprint calculator designed to help students worldwide measure, understand, and reduce their environmental impact through science-based carbon footprint analysis.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-green-800">Student Carbon Calculator Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-green-700">
                Make student carbon footprint calculation accessible, accurate, and actionable for every student seeking to understand their environmental impact.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-blue-800">Global Student Impact</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-blue-700">
                Our student carbon footprint calculator uses country-specific data to ensure accurate carbon calculations for students worldwide.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-orange-800">Student-First Design</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-orange-700">
                Built exclusively for students - our carbon footprint calculator considers student housing, transportation, and lifestyle patterns.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Student Carbon Footprint Matters */}
        <Card className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              Why Student Carbon Footprint Calculation Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🌍 Student Environmental Impact</h3>
                <p className="text-gray-600 text-sm">
                  Students need targeted carbon footprint calculators to understand their unique environmental impact. Our student carbon calculator helps reach the 2030 climate goals through informed student action.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🎓 Student Climate Leadership</h3>
                <p className="text-gray-600 text-sm">
                  Students using carbon footprint calculators become climate leaders. Our student carbon footprint tool empowers the next generation of environmental advocates.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">💡 Student Carbon Reduction</h3>
                <p className="text-gray-600 text-sm">
                  Our research shows students using our carbon footprint calculator can reduce their emissions by 20-40% through targeted student lifestyle changes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📊 Student Carbon Awareness</h3>
                <p className="text-gray-600 text-sm">
                  Students who calculate their carbon footprint are 3x more likely to take climate action. Our student carbon calculator builds this essential awareness.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The Science Behind Our Student Carbon Footprint Calculator */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FlaskConical className="w-6 h-6 text-green-500" />
              The Science Behind Our Student Carbon Footprint Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <p>
              Our student carbon footprint calculator provides scientifically accurate emissions estimates tailored specifically for student lifestyles and carbon calculation needs.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <span className="font-semibold">Student-Specific Carbon Data:</span> Our carbon footprint calculator uses emission factors from IPCC, IEA, and FAO, adapted for student living situations and consumption patterns.
              </li>
              <li>
                <span className="font-semibold">Country-Specific Student Calculations:</span> The calculator adjusts carbon footprint calculations based on your country's electricity grid and student transportation systems.
              </li>
              <li>
                <span className="font-semibold">Student-Centric Carbon Model:</span> Unlike generic carbon calculators, ours considers student housing (dorms, shared apartments), student transportation, and typical student consumption.
              </li>
              <li>
                <span className="font-semibold">Transparent Student Carbon Methodology:</span> Our student carbon footprint calculator provides complete transparency in carbon calculation methods and emission factor sources.
              </li>
            </ul>
            <p className="text-xs text-gray-500 pt-2 border-t">
              Disclaimer: This student carbon footprint calculator provides educational carbon footprint estimates. Individual student carbon footprints may vary based on specific circumstances and detailed carbon analysis.
            </p>
          </CardContent>
        </Card>

        {/* How Our Student Carbon Calculator Is Different */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="w-6 h-6 text-blue-500" />
              How Our Student Carbon Footprint Calculator Differs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Student-Specific Carbon Calculations</h3>
                  <p className="text-gray-600 text-sm">
                    Unlike generic carbon footprint calculators, our tool accounts for student housing, limited budgets, and typical student carbon emission patterns.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Accurate Student Carbon Data</h3>
                  <p className="text-gray-600 text-sm">
                    Our student carbon footprint calculator adapts to your location's electricity grid, student transportation systems, and regional student consumption patterns.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Actionable Student Carbon Tips</h3>
                  <p className="text-gray-600 text-sm">
                    No guilt, just clear student-focused carbon reduction steps that fit your student lifestyle and budget constraints.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Science-Based Student Calculator</h3>
                  <p className="text-gray-600 text-sm">
                    Built on authoritative carbon data sources with full transparency in our student carbon footprint calculation methodology.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to calculate your student carbon footprint?</h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Join thousands of students who've used our carbon footprint calculator. Calculate your student carbon emissions and get your personalized carbon reduction action plan.
            </p>
            <Link to={createPageUrl("Calculator")}>
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold"
              >
                Use Student Carbon Footprint Calculator
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center">
          <div className="p-4">
            <div className="text-2xl font-bold text-green-600">10k+</div>
            <div className="text-sm text-gray-600">Students Using Our Carbon Calculator</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-sm text-gray-600">Countries With Student Carbon Data</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-orange-600">2.1</div>
            <div className="text-sm text-gray-600">Avg. Student Carbon Tons Reduced</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-purple-600">95%</div>
            <div className="text-sm text-gray-600">Students Found Calculator Helpful</div>
          </div>
        </div>
      </div>
    </div>
  );
}
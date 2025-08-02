import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CarbonFootprint } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Share2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

// Lazy load components to reduce initial bundle size
const ResultsHeader = React.lazy(() => import("../components/results/ResultsHeader"));
const EmissionsPieChart = React.lazy(() => import("../components/results/EmissionsPieChart"));
const ComparisonBar = React.lazy(() => import("../components/results/ComparisonBar"));
const ActionableTips = React.lazy(() => import("../components/results/ActionableTips"));
const MethodologySection = React.lazy(() => import("../components/results/MethodologySection"));

// Simple loading fallback component
const ComponentLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
  </div>
);

export default function ResultsPage() {
  const navigate = useNavigate();
  const [footprint, setFootprint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    loadResults();
  }, [window.location.search]);

  const loadResults = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');

      if (id) {
        const result = await CarbonFootprint.get(id);
        setFootprint(result);
      } else {
        navigate(createPageUrl("Calculator"));
      }
    } catch (error) {
      console.error('Error loading results:', error);
      navigate(createPageUrl("Calculator"));
    }
    setIsLoading(false);
  };

  const calculateTreeEquivalent = (emissions) => {
    return Math.round(emissions / 0.021); // 1 tree absorbs ~21 kg CO₂/year
  };

  const shareResults = async () => {
    const gradeText = footprint.user_grade ? `I'm a ${footprint.user_grade.replace('_', ' ')} student and ` : '';
    const shareData = {
      title: 'My Carbon Footprint Results',
      text: `${gradeText}I just calculated my carbon footprint: ${footprint.total_emissions.toFixed(2)} tons CO₂/year. Discover your own impact! 🌱`,
      url: window.location.origin + createPageUrl("Calculator")
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareData.text + ' ' + shareData.url);
      alert('Results copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating your student carbon footprint results...</p>
        </div>
      </div>
    );
  }

  if (!footprint) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">No student carbon footprint results found</h2>
            <p className="text-gray-600 mb-6">Please use our student carbon footprint calculator first to see your results.</p>
            <Button onClick={() => navigate(createPageUrl("Calculator"))}>
              Calculate Student Carbon Footprint
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gradeDisplay = footprint.user_grade ? footprint.user_grade.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Student';

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Calculator"))}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                Your {gradeDisplay} Carbon Footprint Results 🎉
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Student carbon footprint calculated using {footprint.country} emission data</p>
          </div>
        </div>

        {/* Results Header */}
        <React.Suspense fallback={<ComponentLoader />}>
          <ResultsHeader
            totalEmissions={footprint.total_emissions}
            treeEquivalent={calculateTreeEquivalent(footprint.total_emissions)}
            onShare={shareResults}
          />
        </React.Suspense>

        {/* Main Results Grid */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Comparison & Breakdown */}
          <div className="space-y-6 sm:space-y-8">
            <React.Suspense fallback={<ComponentLoader />}>
              <ComparisonBar totalEmissions={footprint.total_emissions} />
            </React.Suspense>
            <React.Suspense fallback={<ComponentLoader />}>
              <EmissionsPieChart breakdown={footprint.breakdown} />
            </React.Suspense>
          </div>

          {/* Tips */}
          <React.Suspense fallback={<ComponentLoader />}>
            <ActionableTips
              footprint={footprint}
            />
          </React.Suspense>
        </div>

        {/* Methodology Section */}
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Lightbulb className="w-5 h-5 text-blue-500" />
                Where did these numbers come from?
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMethodology(!showMethodology)}
                className="flex-shrink-0"
              >
                {showMethodology ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </Button>
            </div>
          </CardHeader>
          {showMethodology && (
            <CardContent>
              <React.Suspense fallback={<ComponentLoader />}>
                <MethodologySection country={footprint.country} />
              </React.Suspense>
            </CardContent>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button
            onClick={() => navigate(createPageUrl("Calculator"))}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            Recalculate Student Carbon Footprint
          </Button>
          <Button
            onClick={shareResults}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 w-full sm:w-auto"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Student Carbon Results
          </Button>
        </div>
      </div>
    </div>
  );
}
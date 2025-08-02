import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Database, Globe } from "lucide-react";

export default function MethodologySection({ country }) {
  const dataSources = [
    {
      name: "IPCC AR6 (2022)",
      description: "Climate change science and emission factors",
      url: "https://www.ipcc.ch/assessment-report/ar6/"
    },
    {
      name: "FAO (2021)",
      description: "Food and agriculture emissions data",
      url: "https://www.fao.org/"
    },
    {
      name: "IEA (2023)",
      description: "Energy statistics and electricity factors",
      url: "https://www.iea.org/"
    },
    {
      name: "Our World in Data (2023)",
      description: "Comprehensive environmental datasets",
      url: "https://ourworldindata.org/"
    }
  ];

  const emissionFactors = {
    'India': { electricity: 720, transport: 'Lower due to smaller vehicles', diet: 'Lower due to plant-based diet' },
    'United States': { electricity: 400, transport: 'Higher due to larger vehicles', diet: 'Higher due to meat consumption' },
    'United Kingdom': { electricity: 220, transport: 'Moderate', diet: 'Moderate' },
    'Australia': { electricity: 600, transport: 'Higher due to distances', diet: 'Higher due to meat consumption' },
    'Global': { electricity: 475, transport: 'Average', diet: 'Average' }
  };

  const countryData = emissionFactors[country] || emissionFactors['Global'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Data Sources
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {dataSources.map((source, index) => (
            <div key={index} className="p-3 bg-white rounded-lg border">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-medium text-sm">{source.name}</h4>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </div>
              <p className="text-xs text-gray-600">{source.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Country-Specific Factors ({country})
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-sm text-blue-900 mb-1">Electricity</h4>
            <p className="text-xs text-blue-700">{countryData.electricity} gCO₂/kWh</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium text-sm text-green-900 mb-1">Transport</h4>
            <p className="text-xs text-green-700">{countryData.transport}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-sm text-orange-900 mb-1">Diet</h4>
            <p className="text-xs text-orange-700">{countryData.diet}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Key Assumptions</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Tree Offset</Badge>
            <span>US Forest Service: 1 tree absorbs ~21 kg CO₂/year</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Phone Charges</Badge>
            <span>~0.02 kg CO₂ per smartphone charge (average usage)</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Student Lifestyle</Badge>
            <span>Calculations adjusted for typical student living situations</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 border-t pt-4">
        <p>
          This calculator provides estimates based on scientific data and typical usage patterns. 
          Individual results may vary based on specific circumstances, local conditions, and lifestyle choices.
        </p>
      </div>
    </div>
  );
}
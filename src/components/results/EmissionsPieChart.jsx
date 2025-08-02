import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Home, Car, Utensils, Smartphone, ShoppingBag, Wind } from "lucide-react";

const COLORS = {
  housing: '#10B981',
  transport: '#3B82F6', 
  food: '#F59E0B',
  digital: '#8B5CF6',
  shopping: '#EF4444',
  misc: '#64748B'
};

const ICONS = {
  housing: Home,
  transport: Car,
  food: Utensils,
  digital: Smartphone,
  shopping: ShoppingBag,
  misc: Wind
};

export default function EmissionsPieChart({ breakdown }) {
  const data = Object.entries(breakdown)
    .filter(([key, value]) => value > 0 && ICONS[key])
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: parseFloat(value.toFixed(2)),
      color: COLORS[key]
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const total = data.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{dataPoint.name}</p>
          <p className="text-sm text-gray-600">
            {dataPoint.value} tons CO₂ ({((dataPoint.value / total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-4">
        {payload.map((entry, index) => {
          const IconComponent = ICONS[entry.payload.name.toLowerCase()];
          return (
            <div key={index} className="flex items-center gap-2">
              {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color: entry.color }} />}
              <span className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="shadow-lg border border-stone-100">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <span className="text-slate-800">Emissions Breakdown</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey="value"
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={2}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
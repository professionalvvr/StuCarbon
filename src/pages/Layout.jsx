
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Leaf, GraduationCap } from "lucide-react";

export default function Layout({ children, currentPageName }) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50">
      <style>{`
        :root {
          --primary-emerald: #10B981;
          --primary-teal: #0D9488;
          --primary-amber: #D97706;
          --accent-rose: #E11D48;
          --neutral-slate: #64748B;
          --success-emerald: #059669;
          --warning-amber: #D97706;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Link to={createPageUrl("Calculator")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg relative">
                <GraduationCap className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Leaf className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">StuCarbon
                </h1>
                <p className="text-xs text-slate-500">Student Carbon Footprint Calculator</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>);

}

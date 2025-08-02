
import React from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Clock, Target, ArrowRight, Calculator, Zap, TreePine, GraduationCap, Users, Globe } from "lucide-react";
import { motion } from "framer-motion";

const WelcomeScreen = ({ onStart }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      {/* Enhanced animated background shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
      <div className="absolute top-40 right-20 w-80 h-80 bg-teal-200/40 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>

      {/* Floating Icons - Positioned carefully for all screen sizes */}
      {/* The BookOpen icon was here and has been removed as per the request. */}
      <motion.div
        className="absolute top-8 right-4 md:top-16 md:right-24 text-teal-400/20"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "2s" }}
      >
        <GraduationCap className="w-7 h-7 md:w-12 md:h-12" />
      </motion.div>
      <motion.div
        className="absolute bottom-8 right-4 md:bottom-24 md:right-16 text-blue-400/20"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "4s" }}
      >
        <Calculator className="w-5 h-5 md:w-8 md:h-8" />
      </motion.div>
      <motion.div
        className="absolute bottom-8 left-4 md:bottom-16 md:left-24 text-purple-400/20"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "1s" }}
      >
        <Users className="w-6 h-6 md:w-10 md:h-10" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 left-2 md:top-1/2 md:-translate-y-1/2 md:right-32 md:left-auto text-green-400/20"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "3s" }}
      >
        <TreePine className="w-5 h-5 md:w-9 md:h-9" />
      </motion.div>

      <motion.div
        className="relative z-10 text-center max-w-5xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Heading with Color Highlights */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="text-slate-800">Student</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            Carbon Footprint
          </span>{" "}
          <span className="text-slate-800">Calculator</span>
        </motion.h1>
        
        {/* Subtitle with Visual Elements */}
        <motion.div
          variants={itemVariants}
          className="mb-12 max-w-3xl mx-auto"
        >
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30">
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed text-center">
              Calculate your <span className="font-bold text-emerald-600">student carbon footprint</span> 🌱 in under{" "}
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-base font-semibold">
                <Clock className="w-4 h-4" />
                2 minutes
              </span>
              .
              <br />
              Get <span className="font-semibold text-blue-600">personalized data</span> 📊 and <span className="font-semibold text-amber-600">actionable tips</span> 💡 to reduce your environmental impact.
            </p>
          </div>
        </motion.div>
        
        {/* CTA Button */}
        <motion.div variants={itemVariants} className="mb-16">
          <Button 
            onClick={onStart}
            size="lg"
            className="group relative overflow-hidden w-full max-w-md sm:w-auto sm:max-w-none bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-5 text-lg sm:px-12 sm:py-6 sm:text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-0"
          >
            <span className="relative z-10 flex items-center justify-center gap-3 text-center">
              <Calculator className="w-6 h-6 flex-shrink-0" />
              <span>Calculate My Footprint</span>
              <ArrowRight className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </Button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-8"
          variants={itemVariants}
        >
          <motion.div 
            className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/40 hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Country-Accurate</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Results tailored to your country's <span className="font-semibold text-blue-600">emission standards</span> for maximum accuracy.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/40 hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Quick Assessment</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Complete your <span className="font-semibold text-emerald-600">student carbon footprint</span> calculation in just 2 minutes.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/40 hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Student-Focused</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  <span className="font-semibold text-teal-600">Carbon footprint calculator</span> designed specifically for student lifestyles.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Heart,
  BookOpen,
  Shield,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const SCREENS = [
  {
    icon: Sparkles,
    title: "Welcome to ScottyMeet",
    subtitle: "The dating app made exclusively for Carnegie Mellon undergrads",
    gradient: "from-rose-500 to-pink-600",
    bgGradient: "from-rose-50 to-pink-50",
    description: "Verified CMU students only. Find your match on campus.",
  },
  {
    icon: Heart,
    title: "Swipe & Match",
    subtitle: "Find your perfect match among fellow Scotties",
    gradient: "from-pink-500 to-purple-600",
    bgGradient: "from-pink-50 to-purple-50",
    description:
      "Swipe right to like, left to pass. When both swipe right, it's a match!",
  },
  {
    icon: BookOpen,
    title: "Study Date Mode",
    subtitle: "Not just romance — find study partners too",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    description:
      "Toggle between Dating and Study mode. Connect for romance or academics.",
  },
  {
    icon: Shield,
    title: "Safe & Private",
    subtitle: "Your campus, your rules",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    description:
      "Andrew ID verified. Block & report features. What happens at CMU stays at CMU.",
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const screen = SCREENS[step];
  const isLast = step === SCREENS.length - 1;

  return (
    <div
      className={`h-full flex flex-col bg-gradient-to-b ${screen.bgGradient} transition-colors duration-500`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col items-center justify-center px-8"
        >
          {/* Icon */}
          <motion.div
            className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${screen.gradient} flex items-center justify-center shadow-lg mb-8`}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", damping: 15 }}
          >
            <screen.icon className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-2xl font-bold text-gray-900 text-center mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {screen.title}
          </motion.h1>

          <motion.p
            className={`text-sm font-medium text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r ${screen.gradient}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {screen.subtitle}
          </motion.p>

          <motion.p
            className="text-sm text-gray-500 text-center leading-relaxed max-w-[280px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {screen.description}
          </motion.p>

          {step === 0 && (
            <motion.div
              className="flex items-center gap-2 mt-6 text-xs text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Exclusive to CMU undergrads</span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom navigation */}
      <div className="px-8 pb-8">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {SCREENS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? `w-8 bg-gradient-to-r ${screen.gradient}`
                  : i < step
                  ? "w-2 bg-gray-300"
                  : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={() => {
            if (isLast) {
              onComplete();
            } else {
              setStep((s) => s + 1);
            }
          }}
          className={`w-full h-13 rounded-full text-sm font-semibold bg-gradient-to-r ${screen.gradient} hover:opacity-90 transition-opacity text-white shadow-lg`}
        >
          {isLast ? (
            <>
              Get Started
              <Sparkles className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {!isLast && (
          <button
            onClick={onComplete}
            className="w-full text-center text-xs text-gray-400 mt-3 hover:text-gray-600 transition-colors"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

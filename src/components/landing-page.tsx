"use client";

import { motion } from "framer-motion";
import {
  Heart,
  BookOpen,
  Shield,
  Sparkles,
  ArrowRight,
  Users,
  Zap,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onLaunch: () => void;
}

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const FEATURES = [
  {
    icon: Heart,
    title: "Swipe to Match",
    desc: "Classic swipe mechanics. Right for like, left for pass. Mutual likes create a match.",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
  },
  {
    icon: BookOpen,
    title: "Study Date Mode",
    desc: "Not just romance. Toggle to find study partners for your toughest classes.",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "CMU Verified",
    desc: "Andrew ID authentication. Only real CMU undergrads. Safe and private.",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Zap,
    title: "Tartan Crush",
    desc: "Send anonymous signals to your crush. If they signal back, it's a reveal!",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
  },
];

const STATS = [
  { value: "6,900+", label: "CMU Undergrads" },
  { value: "7", label: "Colleges" },
  { value: "∞", label: "Possibilities" },
];

export function LandingPage({ onLaunch }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#faf9f7] overflow-x-hidden selection:bg-rose-200 selection:text-rose-900">
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col">
        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-200/50">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Scotty<span className="text-rose-500">Meet</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
              <GraduationCap className="w-3.5 h-3.5" />
              CMU Only
            </span>
            <Button
              onClick={onLaunch}
              className="rounded-full bg-gray-900 hover:bg-gray-800 text-white text-sm px-5 h-9 shadow-lg"
            >
              Try Demo
            </Button>
          </div>
        </motion.nav>

        {/* Hero content */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 md:px-12 pb-12 gap-12 lg:gap-20">
          {/* Left: Copy */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-lg text-center lg:text-left"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                <MapPin className="w-3 h-3" />
                Pittsburgh, PA &middot; Carnegie Mellon University
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 leading-[0.95]"
            >
              Find your
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500">
                match
              </span>
              <br />
              on campus.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg text-gray-500 leading-relaxed max-w-md mx-auto lg:mx-0"
            >
              The dating app built{" "}
              <span className="font-semibold text-gray-700">
                exclusively for CMU undergrads
              </span>
              . Swipe, match, and connect with fellow Scotties &mdash; for
              romance or study sessions.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
            >
              <Button
                onClick={onLaunch}
                size="lg"
                className="rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-base px-8 h-13 shadow-xl shadow-rose-200/50 group"
              >
                Launch App
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <span className="text-sm text-gray-400 flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                Interactive demo &middot; No login needed
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="mt-12 flex items-center justify-center lg:justify-start gap-8"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-2xl font-black text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Phone mockup */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            {/* Glow */}
            <div className="absolute -inset-12 bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-purple-200/40 rounded-full blur-3xl" />

            {/* Floating badges */}
            <motion.div
              className="absolute -left-10 top-24 bg-white rounded-2xl shadow-xl px-4 py-3 z-20 border border-gray-100"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">New Match!</p>
                  <p className="text-[10px] text-gray-400">
                    Maya liked you back
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-8 top-48 bg-white rounded-2xl shadow-xl px-4 py-3 z-20 border border-gray-100"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Study Buddy
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Gates 5th floor?
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -left-6 bottom-32 bg-white rounded-2xl shadow-xl px-4 py-3 z-20 border border-gray-100"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Tartan Crush
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Someone has a crush!
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Phone */}
            <div className="relative w-[280px] h-[560px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[6px] border-gray-900 z-10">
              {/* Screen content - simulated app */}
              <div className="relative h-full bg-gray-50 overflow-hidden">
                {/* Status bar */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-30" />

                {/* App header */}
                <div className="pt-10 px-5 pb-3 bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        ScottyMeet
                      </span>
                    </div>
                    <div className="flex bg-gray-100 rounded-full p-0.5">
                      <span className="text-[9px] font-semibold px-2 py-1 rounded-full bg-white text-rose-500 shadow-sm">
                        Dating
                      </span>
                      <span className="text-[9px] font-semibold px-2 py-1 rounded-full text-gray-400">
                        Study
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fake profile card */}
                <div className="px-4 pt-3">
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100">
                    <div className="h-48 bg-gradient-to-br from-rose-200 via-pink-100 to-purple-200 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-4xl">🎓</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-gray-900">
                          Maya
                        </span>
                        <span className="text-sm text-gray-400">20</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        CS &middot; School of Computer Science
                      </p>
                      <div className="flex gap-1 mt-2">
                        <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                          Coffee
                        </span>
                        <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                          Hiking
                        </span>
                        <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                          Robotics
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fake action buttons */}
                <div className="flex justify-center gap-4 mt-4">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-red-200 flex items-center justify-center shadow">
                    <span className="text-red-400 text-sm">✕</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-200 flex items-center justify-center shadow">
                    <Heart className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-3 rounded-full bg-gray-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-12 py-24 bg-white">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-[0.2em]">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
              Not just another
              <br />
              dating app.
            </h2>
            <p className="text-gray-500 mt-4 max-w-md mx-auto">
              Built by Scotties, for Scotties. Every feature designed around the
              CMU experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className={`${feature.bg} rounded-3xl p-8 group hover:shadow-lg transition-shadow duration-300 border border-gray-100/50`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Social Proof Section */}
      <section className="px-6 md:px-12 py-24 bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeUp}>
            <span className="text-xs font-bold text-rose-500 uppercase tracking-[0.2em]">
              Why ScottyMeet
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
              Designed for the
              <br />
              CMU lifestyle.
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="grid sm:grid-cols-3 gap-8 mt-16"
          >
            {[
              {
                emoji: "🏫",
                title: "College Filters",
                desc: "Filter by SCS, CIT, CFA, Tepper, Dietrich, MCS, or SDS.",
              },
              {
                emoji: "📅",
                title: "Class Year",
                desc: "Match with your graduating class or explore other years.",
              },
              {
                emoji: "🔒",
                title: "Andrew ID Only",
                desc: "Verified @andrew.cmu.edu email required. No catfishing.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <span className="text-4xl">{item.emoji}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 rounded-[2rem] p-12 md:p-16 shadow-2xl shadow-rose-200/50 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Ready to meet your
              <br />
              fellow Scotties?
            </h2>
            <p className="text-white/70 mt-4 max-w-md mx-auto">
              Try the interactive demo and see how ScottyMeet works. Swipe
              through real CMU profiles and experience the app firsthand.
            </p>
            <Button
              onClick={onLaunch}
              size="lg"
              className="mt-8 rounded-full bg-white text-rose-600 hover:bg-gray-50 text-base px-8 h-13 font-bold shadow-xl group"
            >
              Launch Demo
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">
              Scotty<span className="text-rose-500">Meet</span>
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Made with ❤️ at Carnegie Mellon University &middot; For Scotties, by
            Scotties
          </p>
        </div>
      </footer>
    </div>
  );
}

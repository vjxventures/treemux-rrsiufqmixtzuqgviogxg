"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiPost } from "@/lib/api";
import { Heart, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

const COLLEGES = [
  "School of Computer Science",
  "College of Engineering",
  "Dietrich College",
  "College of Fine Arts",
  "Tepper School of Business",
  "Mellon College of Science",
  "School of Information Systems & Management",
];

const ACTIVITIES = [
  "ScottyLabs", "AI Club", "Robotics Club", "Scotch'n'Soda", "AB Films",
  "The Tartan", "WRCT Radio", "Design Club", "Dance Marathon", "Kiltie Band",
  "Competitive Programming", "Women in CS", "Finance Club", "Hiking Club",
  "Board Game Club", "Cooking Club", "Yoga", "Varsity Sports", "Improv Club",
  "Entrepreneurship Club", "Astronomy Club", "SWE", "IEEE",
];

const STUDY_SPOTS = [
  "Gates Hillman", "Hunt Library", "Sorrells Library", "Tepper Quad",
  "Maggie Murph Cafe", "Entropy+", "CFA", "Hamerschlag Hall",
  "Wean Hall", "Doherty Hall", "NSH", "Baker Hall", "The Cut", "CUC",
];

interface AuthScreenProps {
  onAuth: () => void;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<"welcome" | "login" | "register">("welcome");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [interestedIn, setInterestedIn] = useState("");
  const [college, setCollege] = useState("");
  const [major, setMajor] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [bio, setBio] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedSpots, setSelectedSpots] = useState<string[]>([]);

  const toggleActivity = (a: string) => {
    setSelectedActivities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const toggleSpot = (s: string) => {
    setSelectedSpots((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const res = await apiPost("/api/auth/login", { email, password });
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      onAuth();
    }
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    const res = await apiPost("/api/auth/register", {
      email,
      password,
      name,
      age: parseInt(age),
      gender,
      interested_in: interestedIn,
      college,
      major,
      grad_year: parseInt(gradYear),
      bio,
      activities: selectedActivities,
      study_spots: selectedSpots,
    });
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      onAuth();
    }
  };

  if (mode === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          {/* Tartan pattern accent */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-200">
              <Heart className="w-10 h-10 text-white" fill="white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Tartan<span className="text-rose-500">Match</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm">Dating for CMU Undergrads</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setMode("register")}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-lg shadow-rose-200/50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Account
            </Button>
            <Button
              onClick={() => setMode("login")}
              variant="outline"
              className="w-full h-12 text-base font-semibold"
            >
              Sign In
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Exclusively for @andrew.cmu.edu emails
          </p>

          {/* Demo hint */}
          <div className="mt-8 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-500">
              <strong>Demo:</strong> Sign in with any seeded email like{" "}
              <span className="font-mono text-rose-500">alexchen@andrew.cmu.edu</span>{" "}
              with password <span className="font-mono text-rose-500">demo123</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <button onClick={() => setMode("welcome")} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <CardTitle className="text-xl font-bold">Welcome back</CardTitle>
            <p className="text-sm text-gray-500">Sign in to TartanMatch</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="andrew_id@andrew.cmu.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <Input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Registration steps
  const steps = [
    // Step 0: basics
    <div key="basics" className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">CMU Email</label>
        <Input
          placeholder="andrew_id@andrew.cmu.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
        <Input
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Age</label>
        <Input
          placeholder="18"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          type="number"
          min={18}
          max={25}
        />
      </div>
    </div>,
    // Step 1: identity
    <div key="identity" className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">I am</label>
        <div className="grid grid-cols-3 gap-2">
          {["male", "female", "non-binary"].map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`p-3 rounded-xl text-sm font-medium border-2 transition-all ${
                gender === g
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
              }`}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Interested in</label>
        <div className="grid grid-cols-3 gap-2">
          {["male", "female", "everyone"].map((g) => (
            <button
              key={g}
              onClick={() => setInterestedIn(g)}
              className={`p-3 rounded-xl text-sm font-medium border-2 transition-all ${
                interestedIn === g
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
              }`}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>,
    // Step 2: academics
    <div key="academics" className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">College</label>
        <div className="grid gap-2">
          {COLLEGES.map((c) => (
            <button
              key={c}
              onClick={() => setCollege(c)}
              className={`p-3 rounded-xl text-sm text-left font-medium border-2 transition-all ${
                college === c
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Major</label>
        <Input
          placeholder="e.g. Computer Science"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Graduation Year</label>
        <Input
          placeholder="2027"
          value={gradYear}
          onChange={(e) => setGradYear(e.target.value)}
          type="number"
          min={2025}
          max={2030}
        />
      </div>
    </div>,
    // Step 3: bio + activities
    <div key="bio" className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Bio</label>
        <Textarea
          placeholder="Tell people about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={300}
        />
        <p className="text-xs text-gray-400 mt-1">{bio.length}/300</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Activities (pick a few)</label>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          {ACTIVITIES.map((a) => (
            <button
              key={a}
              onClick={() => toggleActivity(a)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedActivities.includes(a)
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Favorite study spots</label>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
          {STUDY_SPOTS.map((s) => (
            <button
              key={s}
              onClick={() => toggleSpot(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedSpots.includes(s)
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>,
  ];

  const stepTitles = ["Account", "About You", "Academics", "Your Profile"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-0 shadow-xl">
        <CardHeader className="pb-2">
          <button
            onClick={() => (step === 0 ? setMode("welcome") : setStep(step - 1))}
            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <CardTitle className="text-xl font-bold text-center">{stepTitles[step]}</CardTitle>
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 pt-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i <= step ? "w-8 bg-rose-500" : "w-4 bg-gray-200"
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {steps[step]}
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
          <div className="mt-6">
            {step < steps.length - 1 ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="w-full bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600"
              >
                {loading ? "Creating profile..." : "Start Matching"}
                <Heart className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

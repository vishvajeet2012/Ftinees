/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Image from "next/image";

import api from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z.coerce.number().int().positive("Age is required"),
  gender: z.enum(["male", "female", "other"]),
  feet: z.coerce.number().int().min(1, "Required"),
  inches: z.coerce.number().int().min(0).max(11),
  weight: z.coerce.number().positive("Weight is required"),
  location: z.object({
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    district: z.string().optional(),
    town: z.string().optional(),
  }),
  goal: z.enum(["muscle_gain", "weight_loss", "maintenance", "strength"]),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
  activityLevel: z.enum(["sedentary", "lightly_active", "moderately_active", "very_active"]),
  pushups: z.coerce.number().int().min(0).optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const signupSteps = [
  { id: 1, title: "Account" },
  { id: 2, title: "You" },
  { id: 3, title: "Location" },
  { id: 4, title: "Goals" },
];

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [locationLoading, setLocationLoading] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      age: undefined,
      gender: undefined,
      feet: undefined,
      inches: 0,
      weight: undefined,
      location: { country: "", state: "", district: "", town: "" },
      goal: undefined,
      fitnessLevel: undefined,
      activityLevel: undefined,
      pushups: 0,
    },
  });

  // Login Submit
  const onLoginSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      const { token, name } = res.data.data;
      Cookies.set("token", token, { expires: 30 });
      toast.success(`Welcome back, ${name}!`);
      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error("Login Failed", { description: err.response?.data?.message || "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  // Signup Submit
  const onSignupSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      const heightInCm = data.feet * 30.48 + data.inches * 2.54;
      const payload = { ...data, height: Math.round(heightInCm) };
      const res = await api.post("/auth/register", payload);
      const { token, onboardingNote } = res.data.data;
      Cookies.set("token", token, { expires: 30 });
      toast.success("Welcome!", { description: onboardingNote });
      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error("Registration Failed", { description: err.response?.data?.message || "Please try again" });
    } finally {
      setLoading(false);
    }
  };

  // Auto-detect location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const addr = data.address || {};
          signupForm.setValue("location.country", addr.country || "");
          signupForm.setValue("location.state", addr.state || "");
          signupForm.setValue("location.district", addr.county || addr.state_district || "");
          signupForm.setValue("location.town", addr.city || addr.town || addr.village || "");
          toast.success("Location detected!");
        } catch {
          toast.error("Could not fetch location details");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        toast.error("Location access denied");
        setLocationLoading(false);
      }
    );
  };

  // Step Navigation
  const nextStep = async () => {
    const fields: (keyof SignupFormData)[][] = [
      ["name", "email", "password"],
      ["age", "gender", "feet", "inches", "weight"],
      ["location"],
      ["goal", "fitnessLevel", "activityLevel"],
    ];
    const valid = await signupForm.trigger(fields[signupStep - 1]);
    if (valid) setSignupStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setSignupStep((s) => Math.max(s - 1, 1));

  return (
    <div className="relative flex justify-center items-center min-h-screen p-4 overflow-hidden bg-black selection:bg-primary/30">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] opacity-50 delay-1000 animate-pulse" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />

      <Card className="relative w-full max-w-lg overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/60 backdrop-blur-2xl ring-1 ring-white/5 md:rounded-3xl flex flex-col min-h-screen md:min-h-auto md:h-auto">
        
        {/* Header - Sticky & Glassy */}
        <div className="p-8 pb-4 flex flex-col items-center border-b border-white/5 shrink-0 bg-zinc-900/40 backdrop-blur-md sticky top-0 z-20">
          <div className="relative mb-4">
             <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full opacity-50" />
             <Image src="/logo.svg" alt="FitMetric" width={48} height={48} className="relative z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
          </div>
          
          {mode === "login" ? (
             <div className="text-center space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
                <p className="text-zinc-400 text-sm">Resume your fitness journey</p>
             </div>
          ) : (
             <div className="w-full mt-2">
                <div className="flex justify-between items-end mb-3 px-1">
                    <div>
                        <h1 className="text-xl font-bold text-white">Create Account</h1>
                        <p className="text-xs text-zinc-500">Let&apos;s get you set up</p>
                    </div>
                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">Step {signupStep}/4</span>
                </div>
                {/* Neon Progress Bar */}
                <div className="flex gap-2 h-1.5 w-full">
                    {signupSteps.map((s) => (
                        <div key={s.id} className={`flex-1 rounded-full transition-all duration-500 ${signupStep >= s.id ? 'bg-gradient-to-r from-primary to-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-zinc-800'}`} />
                    ))}
                </div>
             </div>
          )}
        </div>

        {/* Mode Toggle - Stylish Pill */}
        {mode === "login" && (
            <div className="mx-8 mt-6 p-1 bg-zinc-950/50 rounded-xl border border-white/5 flex shrink-0 relative">
                <button
                    onClick={() => { setMode("login"); setSignupStep(1); }}
                    className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 z-10 text-white shadow-lg bg-zinc-800"
                >
                    Login
                </button>
                <button
                    onClick={() => setMode("signup")}
                    className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 z-10 text-zinc-500 hover:text-zinc-300"
                >
                    Sign Up
                </button>
             </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 pb-32 md:pb-8 relative scrollbar-hide">
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5 pt-2">
                    <FormField control={loginForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Email Address</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="you@example.com" className="h-12 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-primary/50 focus:border-primary/50 transition-all rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )} />
                    <FormField control={loginForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="••••••••" className="h-12 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-primary/50 focus:border-primary/50 transition-all rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )} />
                    
                    <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-to-r from-primary to-emerald-500 hover:to-emerald-400 text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all duration-300 mt-4">
                      {loading ? <Loader2 className="animate-spin" /> : "Sign In & Start"}
                    </Button>
                    
                    <div className="text-center pt-6">
                        <p className="text-sm text-zinc-500">New here? <button type="button" onClick={() => setMode("signup")} className="text-primary hover:text-emerald-300 hover:underline font-semibold transition-colors">Create free account</button></p>
                    </div>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="pt-2"
              >
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6">
                    <AnimatePresence mode="wait">
                      {signupStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                            <h3 className="text-white font-semibold text-lg flex items-center gap-2"><span className="w-1 h-6 bg-primary rounded-full"/> Basic Info</h3>
                          <FormField control={signupForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel className="text-zinc-400">Full Name</FormLabel><FormControl><Input placeholder="John Doe" className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={signupForm.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel className="text-zinc-400">Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={signupForm.control} name="password" render={({ field }) => (
                            <FormItem><FormLabel className="text-zinc-400">Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </motion.div>
                      )}
                      
                      {/* Similar upgrades for other steps, keeping logic but upgrading classes */}
                      {signupStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                            <h3 className="text-white font-semibold text-lg flex items-center gap-2"><span className="w-1 h-6 bg-primary rounded-full"/> Body Stats</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={signupForm.control} name="age" render={({ field }) => (
                              <FormItem><FormLabel className="text-zinc-400">Age</FormLabel><FormControl><Input type="number" className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50" {...field as any} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={signupForm.control} name="gender" render={({ field }) => (
                              <FormItem><FormLabel className="text-zinc-400">Gender</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50"><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent className="bg-zinc-900 border-zinc-800 text-white"><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <FormField control={signupForm.control} name="feet" render={({ field }) => (
                              <FormItem><FormLabel className="text-zinc-400">Ft</FormLabel><FormControl><Input type="number" className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50" {...field as any} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={signupForm.control} name="inches" render={({ field }) => (
                              <FormItem><FormLabel className="text-zinc-400">In</FormLabel><FormControl><Input type="number" className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50" {...field as any} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={signupForm.control} name="weight" render={({ field }) => (
                              <FormItem><FormLabel className="text-zinc-400">Kg</FormLabel><FormControl><Input type="number" className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50" {...field as any} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>
                        </motion.div>
                      )}

                      {signupStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                           <h3 className="text-white font-semibold text-lg flex items-center gap-2"><span className="w-1 h-6 bg-primary rounded-full"/> Location</h3>
                          <Button type="button" variant="outline" onClick={detectLocation} disabled={locationLoading} className="w-full h-12 gap-2 border-primary/20 text-primary hover:bg-primary/10 bg-transparent rounded-xl">
                            {locationLoading ? <Loader2 className="animate-spin" /> : <MapPin className="w-4 h-4" />} Auto-Detect Location
                          </Button>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={signupForm.control} name="location.country" render={({ field }) => (
                              <FormItem><FormLabel className="text-zinc-400">Country</FormLabel><FormControl><Input className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={signupForm.control} name="location.state" render={({ field }) => (
                              <FormItem><FormLabel className="text-zinc-400">State</FormLabel><FormControl><Input className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={signupForm.control} name="location.district" render={({ field }) => (
                              <FormItem><FormLabel className="text-zinc-400">District</FormLabel><FormControl><Input className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={signupForm.control} name="location.town" render={({ field }) => (
                              <FormItem><FormLabel className="text-zinc-400">Town</FormLabel><FormControl><Input className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>
                        </motion.div>
                      )}

                      {signupStep === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                           <h3 className="text-white font-semibold text-lg flex items-center gap-2"><span className="w-1 h-6 bg-primary rounded-full"/> Final Goal</h3>
                          <FormField control={signupForm.control} name="goal" render={({ field }) => (
                            <FormItem><FormLabel className="text-zinc-400">Primary Goal</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50"><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent className="bg-zinc-900 border-zinc-800 text-white"><SelectItem value="muscle_gain">Muscle Gain</SelectItem><SelectItem value="weight_loss">Weight Loss</SelectItem><SelectItem value="strength">Strength</SelectItem><SelectItem value="maintenance">Maintenance</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                          )} />
                          <FormField control={signupForm.control} name="fitnessLevel" render={({ field }) => (
                            <FormItem><FormLabel className="text-zinc-400">Fitness Level</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50"><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent className="bg-zinc-900 border-zinc-800 text-white"><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="intermediate">Intermediate</SelectItem><SelectItem value="advanced">Advanced</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                          )} />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={signupForm.control} name="activityLevel" render={({ field }) => (
                              <FormItem><FormLabel className="text-zinc-400">Activity</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50"><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent className="bg-zinc-900 border-zinc-800 text-white"><SelectItem value="sedentary">Sedentary</SelectItem><SelectItem value="lightly_active">Light</SelectItem><SelectItem value="moderately_active">Moderate</SelectItem><SelectItem value="very_active">Very Active</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={signupForm.control} name="pushups" render={({ field }) => (
                              <FormItem><FormLabel className="text-zinc-400">Max Pushups</FormLabel><FormControl><Input type="number" className="h-12 bg-zinc-950/50 border-zinc-800 text-white rounded-xl focus:border-primary/50" {...field as any} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Nav for Signup (Fixed & Floating) */}
        {mode === "signup" && (
            <div className="flex justify-between items-center p-6 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl md:static fixed bottom-0 left-0 right-0 z-20">
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={signupStep === 1 ? () => setMode("login") : prevStep} 
                    className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl h-12"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> {signupStep === 1 ? "Cancel" : "Back"}
                </Button>
                
                {signupStep < 4 ? (
                    <Button type="button" onClick={nextStep} className="bg-gradient-to-r from-primary to-emerald-500 hover:to-emerald-400 text-black font-bold px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all">Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
                ) : (
                    <Button type="button" onClick={signupForm.handleSubmit(onSignupSubmit)} disabled={loading} className="bg-gradient-to-r from-primary to-emerald-500 hover:to-emerald-400 text-black font-bold px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all">
                        {loading ? <Loader2 className="animate-spin" /> : "Complete Setup"}
                    </Button>
                )}
            </div>
        )}

      </Card>
    </div>
  );
}

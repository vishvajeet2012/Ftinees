"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import api from "@/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle2, Dumbbell, Flame, Loader2, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Cookies from "js-cookie"

interface Exercise {
  name: string
  sets?: number
  reps?: number
  duration?: string
  muscleGroup: string
}

interface DayPlan {
  day: number
  dayName: string
  isRestDay: boolean
  exercises: Exercise[]
}

interface Plan {
  _id: string
  planName: string
  description: string
  fitnessLevel: string
  goal: string
  durationWeeks: number
  daysPerWeek: number
  weeklyPlan: DayPlan[]
}

export default function PlanPage() {
  const router = useRouter()
  const { user, setAuth } = useAuthStore()
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")

  // Fetch or generate plan on mount
  useEffect(() => {
    fetchPlan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchPlan = async () => {
    try {
      setLoading(true)
      const res = await api.get("/plans/current")
      if (res.data.success) {
        setPlan(res.data.data)
      }
    } catch (err: unknown) {
      // No plan exists, generate one
      if ((err as { response?: { status?: number } })?.response?.status === 404) {
        await generatePlan()
      } else {
        setError("Failed to load plan")
      }
    } finally {
      setLoading(false)
    }
  }

  const generatePlan = async () => {
    try {
      setGenerating(true)
      const res = await api.post("/plans/generate", {
        goal: "general_fitness"
      })
      if (res.data.success) {
        setPlan(res.data.data)
      }
    } catch {
      setError("Failed to generate plan")
    } finally {
      setGenerating(false)
    }
  }

  const completeOnboarding = async () => {
    try {
      // Update user's hasCompletedOnboarding flag
      await api.put("/auth/profile", { hasCompletedOnboarding: true })
      
      // Update local user state
      if (user) {
        setAuth({ ...user, hasCompletedOnboarding: true }, Cookies.get("token") || "")
      }
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch {
      setError("Failed to complete onboarding")
    }
  }

  if (loading || generating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-white font-medium">
            {generating ? "Generating your personalized plan..." : "Loading..."}
          </p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="bg-zinc-900/50 border-red-500/20">
          <CardContent className="p-6 text-center">
            <p className="text-red-400">{error}</p>
            <Button onClick={fetchPlan} className="mt-4">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Your Personalized Plan</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {plan?.planName}
          </h1>
          <p className="text-zinc-400">{plan?.description}</p>
        </motion.div>

        {/* Plan Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-zinc-900/50 border-white/5">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-2xl font-bold text-white">{plan?.durationWeeks}</p>
              <p className="text-xs text-zinc-500">Weeks</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5">
            <CardContent className="p-4 text-center">
              <Dumbbell className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
              <p className="text-2xl font-bold text-white">{plan?.daysPerWeek}</p>
              <p className="text-xs text-zinc-500">Days/Week</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5">
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-orange-400" />
              <p className="text-2xl font-bold text-white capitalize">{plan?.fitnessLevel}</p>
              <p className="text-xs text-zinc-500">Level</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Schedule */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-zinc-900/50 border-white/5 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Weekly Schedule
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Your workout plan for each day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan?.weeklyPlan.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    day.isRestDay 
                      ? "bg-zinc-800/30 border-zinc-700/30" 
                      : "bg-black/40 border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{day.dayName}</span>
                    {day.isRestDay ? (
                      <span className="text-xs bg-zinc-700/50 text-zinc-400 px-2 py-1 rounded-full">
                        Rest Day 😴
                      </span>
                    ) : (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {day.exercises.length} Exercises
                      </span>
                    )}
                  </div>
                  
                  {!day.isRestDay && (
                    <div className="space-y-2 mt-3">
                      {day.exercises.map((ex, j) => (
                        <div 
                          key={j} 
                          className="flex items-center justify-between text-sm bg-zinc-800/50 rounded-lg px-3 py-2"
                        >
                          <span className="text-zinc-300">{ex.name}</span>
                          <span className="text-zinc-500">
                            {ex.sets && ex.reps 
                              ? `${ex.sets} × ${ex.reps}` 
                              : ex.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Button 
            onClick={completeOnboarding}
            className="w-full bg-linear-to-r from-primary to-emerald-500 text-black font-bold py-6 text-lg shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] transition-all"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Start My Fitness Journey
          </Button>
          <p className="text-center text-xs text-zinc-500 mt-3">
            You can modify your plan anytime from the dashboard
          </p>
        </motion.div>
      </div>
    </div>
  )
}

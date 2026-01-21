"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ArrowRight, Dumbbell, Heart, Target, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default function ScorePage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [animatedScore, setAnimatedScore] = useState(0)

  const fitnessScore = user?.fitnessScore || 50

  // Animate score on mount
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = fitnessScore / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= fitnessScore) {
        setAnimatedScore(fitnessScore)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [fitnessScore])

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score < 40) return "text-red-500"
    if (score < 70) return "text-yellow-500"
    return "text-emerald-500"
  }

  // Get fitness level label
  const getFitnessLevel = (score: number) => {
    if (score < 40) return { label: "Beginner", color: "bg-red-500/10 text-red-400 border-red-500/20" }
    if (score < 70) return { label: "Intermediate", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" }
    return { label: "Advanced", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }
  }

  const level = getFitnessLevel(fitnessScore)

  const stats = [
    { icon: Heart, label: "BMI", value: user?.weight && user?.height ? (user.weight / ((user.height/100) ** 2)).toFixed(1) : "N/A" },
    { icon: Dumbbell, label: "Push-ups", value: user?.pushups || 0 },
    { icon: Target, label: "Goal", value: user?.fitnessLevel || "General" },
    { icon: Activity, label: "Activity", value: user?.activityLevel?.replace("_", " ") || "Moderate" },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold text-white">
              Welcome, {user?.name?.split(" ")[0] || "Athlete"}! 🎉
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Your AI-calculated Fitness Score is ready
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Score Circle */}
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="relative"
              >
                <div className="w-48 h-48 rounded-full border-8 border-zinc-800 flex items-center justify-center relative overflow-hidden">
                  {/* Animated background glow */}
                  <div className={`absolute inset-0 blur-2xl opacity-30 ${fitnessScore < 40 ? 'bg-red-500' : fitnessScore < 70 ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
                  
                  <div className="text-center z-10">
                    <span className={`text-6xl font-black ${getScoreColor(animatedScore)}`}>
                      {animatedScore}
                    </span>
                    <span className="text-2xl text-zinc-500">/100</span>
                  </div>
                </div>
              </motion.div>

              {/* Level Badge */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4"
              >
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${level.color}`}>
                  {level.label} Level
                </span>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {stats.map((stat, i) => (
                <div key={i} className="bg-black/40 rounded-xl p-4 text-center border border-white/5">
                  <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-lg font-bold text-white capitalize">{stat.value}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="pt-4"
            >
              <Button 
                onClick={() => router.push("/onboarding/plan")}
                className="w-full bg-linear-to-r from-primary to-emerald-500 text-black font-bold py-6 text-lg shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] transition-all"
              >
                <Zap className="mr-2 h-5 w-5" />
                Generate My Workout Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-center text-xs text-zinc-500 mt-3">
                We&apos;ll create a personalized plan based on your score
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

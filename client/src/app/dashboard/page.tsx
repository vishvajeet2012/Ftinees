"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, ArrowUpRight, Dumbbell, Flame, TrendingUp } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"

// Dummy Data
const quickStats = [
  {
    title: "Total Volume",
    value: "14,500 kg",
    change: "+12% from last week",
    icon: Dumbbell,
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    title: "Active Days",
    value: "4 Days",
    change: "Target: 5 days",
    icon: Activity,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10"
  },
  {
    title: "Consistency",
    value: "12 Day Streak",
    change: "Keep it up!",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-400/10"
  },
]

const recentWorkouts = [
  { id: 1, name: "Heavy Chest Day", date: "Today, 9:00 AM", volume: "4,200 kg", duration: "65m" },
  { id: 2, name: "Leg Day Destruction", date: "Yesterday, 6:30 PM", volume: "6,800 kg", duration: "80m" },
  { id: 3, name: "Back & Biceps", date: "Jan 15, 2026", volume: "3,500 kg", duration: "55m" },
]

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Good Morning, {user?.name?.split(" ")[0] || "Athlete"} 👋</h2>
          <p className="text-zinc-400">Ready to crush your goals today?</p>
        </div>
        <div className="flex gap-2">
            <Button className="bg-gradient-to-r from-primary to-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all">
                <Dumbbell className="mr-2 h-4 w-4" /> Log Workout
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickStats.map((stat, i) => (
          <Card key={i} className="bg-zinc-900/50 border-white/5 backdrop-blur-sm hover:border-white/10 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-zinc-500 mt-1 flex items-center">
                 {stat.change.includes('+') ? <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" /> : null}
                 {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        
        {/* Recent Activity */}
        <Card className="col-span-4 bg-zinc-900/50 border-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-zinc-400">Your last 3 workout sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {recentWorkouts.map((workout) => (
                    <div key={workout.id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-primary/20 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 full rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Dumbbell className="h-5 w-5 text-zinc-400 group-hover:text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{workout.name}</p>
                                <p className="text-xs text-zinc-500">{workout.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-white">{workout.volume}</p>
                            <p className="text-xs text-zinc-500">{workout.duration}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-zinc-400 hover:text-white hover:bg-white/5">
                View All History <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* AI Insight Placeholder */}
        <Card className="col-span-3 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-white/5 backdrop-blur-sm relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-[50px]" />
             
             <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-400" /> AI Coach Insight
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-zinc-200 text-sm italic">
                        &quot;{user?.onboardingNote || "Welcome to FitMetric! Start logging workouts to get personalized insights."}&quot;
                    </p>
                    <div className="mt-4 flex gap-2">
                        <span className="text-xs bg-purple-500/10 text-purple-300 px-2 py-1 rounded-full border border-purple-500/20">Recovery: Good</span>
                        <span className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/20">Progress: +5%</span>
                    </div>
                </div>
                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold">
                    Get Detailed Analysis
                </Button>
             </CardContent>
        </Card>
      </div>
    </div>
  )
}

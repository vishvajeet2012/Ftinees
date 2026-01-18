import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <main className="flex flex-col items-center gap-8 px-4 text-center">
       
        <div className="relative flex items-center justify-center p-6">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-3xl" />
          <Image
            src="/logo.svg"
            alt="FitMetric AI Logo"
            width={180}
            height={180}
            className="relative z-10 drop-shadow-2xl transition-transform hover:scale-105"
            priority
          />
        </div>

        {/* Hero Text */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent animate-gradient">
            FitMetric AI
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Your Personalized AI Fitness & Analytics Engine.
            <br />
            <span className="text-sm font-medium opacity-80">Train Smarter. Not Harder.</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/auth" className="w-full sm:w-auto">
          <Button size="lg" className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 text-lg py-6 px-8">
            Get Started
          </Button>
        </Link>
          <Button size="lg" variant="outline" className="rounded-full px-8 text-lg w-full sm:w-auto">
            Learn More
          </Button>
        </div>
      </main>

      <footer className="absolute bottom-6 text-sm text-muted-foreground opacity-60">
        © {new Date().getFullYear()} FitMetric. Powered by Google Gemini.
      </footer>
    </div>
  );
}

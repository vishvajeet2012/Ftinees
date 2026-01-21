import Image from "next/image";
import Link from "next/link";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { OutlineButton } from "@/components/ui/OutlineButton";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <main className="flex flex-col items-center gap-8 px-4 text-center">
       
        <div className="relative flex items-center justify-center p-6">
          <div className="absolute inset-0 animate-pulse rounded-full bg-white/10 blur-3xl" />
          <Image
            src="/logo.svg"
            alt="FitMetric AI Logo"
            width={180}
            height={180}
            className="relative z-10 drop-shadow-2xl transition-transform hover:scale-105 invert"
            priority
          />
        </div>

\        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl text-white">
            FitMetric AI
          </h1>
          <p className="text-xl text-zinc-400 font-light">
            Your Personalized AI Fitness & Analytics Engine.
            <br />
            <span className="text-sm font-medium text-zinc-500">Train Smarter. Not Harder.</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/auth" className="w-full sm:w-auto">
            <PrimaryButton className="w-full">
              Get Started
            </PrimaryButton>
          </Link>
          <OutlineButton className="w-full sm:w-auto h-14 ">
            Learn More
          </OutlineButton>
        </div>
      </main>

      <footer className="absolute bottom-6 text-sm text-zinc-600">
        © {new Date().getFullYear()} FitMetric. Powered by Google Gemini.
      </footer>
    </div>
  );
}

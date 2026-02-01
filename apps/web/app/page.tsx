import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, BarChart3, Zap, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden selection:bg-fuchsia-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[30%] h-[30%] bg-fuchsia-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            AI Data Analyst
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log In
          </Link>
          <Link href="/signup">
            <Button className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-sm font-medium text-cyan-300">v1.0 Public Beta is Live</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500">
            Talk to your data.
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500">
            Uncover insights instantly.
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Upload your datasets, ask questions in plain English, and get enterprise-grade 
          dashboards generated in seconds. No SQL required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Link href="/signup">
            <Button size="lg" className="h-12 px-8 text-lg bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105">
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/api/auth/guest" onClick={(e) => {
             // We'll let the login page handle the guest logic via a redirect or keep it simple here
             // Actually, for simplicity on landing, let's link to login which has the demo button,
             // or direct to the guest API if we implemented a direct route. 
             // The architecture says guests are supported. 
             // Let's link to Login for now as it has the try demo button clearly.
             e.preventDefault();
             window.location.href = '/login'; 
          }}>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white/10 text-white hover:bg-white/5 backdrop-blur-sm">
              Try Live Demo
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-6xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          {[
            {
              icon: BarChart3,
              title: "Instant Visualizations",
              desc: "Turn raw CSVs into interactive charts and dashboards automatically."
            },
            {
              icon: Zap,
              title: "AI-Powered Queries",
              desc: "Ask \"Show me sales by region\" and get the SQL and chart instantly."
            },
            {
              icon: Lock,
              title: "Secure & Private",
              desc: "Enterprise-grade security with isolated environments for your data."
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.07] transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-300 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

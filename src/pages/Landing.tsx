import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Brain, Lightbulb, CheckCircle2, ArrowRight, Star, MessageCircle, BarChart3, Calendar, ArrowUpRight, Lock, ShieldCheck, Github, Linkedin, Twitter, AlertCircle, Compass, FileQuestion, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';


// Import local assets
import mascotImg from '../assets/mascot.png';
import dashboardMockup from '../assets/dashboard_mockup.png';
import chatMockup from '../assets/chat_mockup.png';
import quizMockup from '../assets/quiz_mockup.png';

const problems = [
  { 
    icon: AlertCircle, 
    title: "Confusing Textbooks", 
    description: "Drowning in dense pages without understanding the core concepts and ideas." 
  },
  { 
    icon: Compass, 
    title: "No Personal Tutor", 
    description: "Stuck on a problem with no help late at night, wasting hours searching for answers." 
  },
  { 
    icon: LineChart, 
    title: "Hard to Track Progress", 
    description: "Unsure of what you actually know and where you need to focus more energy." 
  },
  { 
    icon: FileQuestion, 
    title: "Not Enough practice", 
    description: "Running out of quality questions to test your knowledge or prep for exams." 
  },
];

const features = [
  { 
    icon: Brain, 
    title: "AI Tutor", 
    description: "Get instant, simplified explanations for any concept 24/7 with interactive dialogue." 
  },
  { 
    icon: Sparkles, 
    title: "Quiz Generator", 
    description: "Turn your class notes or documents into interactive practice quizzes in seconds." 
  },
  { 
    icon: BarChart3, 
    title: "Study Analytics", 
    description: "Track your mastery, streak count, and visualize knowledge gaps with beautiful charts." 
  },
  { 
    icon: Calendar, 
    title: "Smart Study Plan", 
    description: "Get a personalized roadmap designed around your schedule and learning pace." 
  },
];

const steps = [
  { number: "01", icon: BookOpen, title: "Upload Notes", description: "Upload PDFs, slides, or paste text into the dashboard." },
  { number: "02", icon: MessageCircle, title: "Ask the AI", description: "Chat with your genie to clarify complex topics or ask setup." },
  { number: "03", icon: Sparkles, title: "Generate Quizzes", description: "Create mock exams from content instantly with explanations." },
  { number: "04", icon: BarChart3, title: "Track Progress", description: "Watch your confidence level and scores rise over time." },
];

const testimonials = [
  { img: "https://randomuser.me/api/portraits/women/45.jpg", name: "Sarah J.", role: "Medical Student", quote: "StudyGenie saved my anatomy prep! The Quiz Generator made flashcards in seconds, retaining the core concepts perfectly.", rating: 5 },
  { img: "https://randomuser.me/api/portraits/men/32.jpg", name: "James L.", role: "High schooler", quote: "I used to hate textbook study sessions. The AI tutor breaks things down into relatable scenarios that make sense.", rating: 5 },
  { img: "https://randomuser.me/api/portraits/women/65.jpg", name: "Emily R.", role: "Computer Science", quote: "The gamification and analytics keep me motivated on long coding grinds. Beats every other study app hands down.", rating: 5 },
];

export default function Landing() {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-primary)]/85 backdrop-blur-md border-b border-gray-400/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src="/logo_mascot_clean.png" alt="Logo" className="w-8 h-8 object-contain animate-float" />








              <span className="text-xl font-bold tracking-tight">
                <span className="text-white">Study</span>
                <span className="text-[#3B82F6]">Genie</span>
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[#2563EB] transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[#2563EB] transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[#2563EB] transition-colors">Pricing</a>
              <a href="#about" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[#2563EB] transition-colors">About</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to={session ? "/dashboard" : "/auth"} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[#2563EB] transition-colors">
                {session ? "Dashboard" : "Login"}
              </Link>
              {!session && (
                <Link to="/auth" className="px-5 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-[10px] shadow-lg shadow-blue-500/20 hover:bg-[#1D4ED8] hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5">
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#2563EB] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#3B82F6]/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '0s' }}></div>
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm space-x-2">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-xs font-semibold text-blue-100">Your AI Study Companion</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Study Smarter With <br />
                <span className="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">StudyGenie AI</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-blue-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Study smarter with an AI tutor that explains concepts, generates quizzes, and helps you master any subject with magical ease.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to={session ? "/dashboard" : "/auth"} className="w-full sm:w-auto px-7 py-3.5 bg-white text-[#1E3A8A] font-bold rounded-xl shadow-xl shadow-blue-900/30 hover:bg-opacity-95 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center">
                  {session ? "Go to Dashboard" : "Start Learning Free"}
                </Link>
                <Link to={session ? "/dashboard" : "/auth"} className="w-full sm:w-auto px-7 py-3.5 bg-transparent border border-white/30 hover:backdrop-blur-sm hover:border-white/50 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>See Demo</span>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex justify-center relative">
              <div className="relative animate-float scale-90 sm:scale-100">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#3B82F6]/40 to-[#2563EB]/40 rounded-full blur-2xl opacity-75"></div>
                 <img 
                  src={mascotImg} 
                  alt="StudyGenie Mascot" 
                  className="relative w-80 h-80 sm:w-96 sm:h-96 object-contain rounded-3xl drop-shadow-[0_0_50px_rgba(59,130,246,0.25)]" 
                  style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
                />











              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] dark:text-white">
              Studying Shouldn't Be This Hard
            </h2>
            <p className="mt-3 text-[var(--text-secondary)] max-w-2xl mx-auto">
              We know the struggle of keeping up with workload and feeling lost.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="p-6 bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] shadow-[var(--card-shadow)] text-left hover:border-[#3B82F6]/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-500 dark:bg-red-900/20 dark:text-red-300 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1E293B] dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] dark:text-white">
              What StudyGenie Can Do
            </h2>
            <p className="mt-3 text-[var(--text-secondary)] max-w-2xl mx-auto">
              Your academic superpower, powered by advanced artificial intelligence.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="group p-6 bg-white dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-slate-700/50 shadow-sm text-left hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 group-hover:bg-[#2563EB] text-[#2563EB] group-hover:text-white flex items-center justify-center mb-4 transition-all duration-300">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1E293B] dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section className="py-20 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold">See StudyGenie in Action</h2>
            <p className="mt-3 text-blue-100/70 max-w-2xl mx-auto">
              Clean dashboard layouts designed to power your learning efficiency.
            </p>
          </motion.div>

          {/* Floating UI Cards */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
            {[dashboardMockup, chatMockup, quizMockup].map((imgUrl, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.2 }} className="group relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-[#3B82F6]/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="aspect-[4/3] bg-gray-900 flex items-center justify-center">
                  <img src={imgUrl} alt="Dashboard mockup" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <div className="absolute -inset-[2px] rounded-2xl border-2 border-transparent group-hover:border-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] dark:text-white">how it works</h2>
          <p className="mt-3 text-[var(--text-secondary)] max-w-2xl mx-auto">Simple steps to superpower study days.</p>

          <div className="mt-16 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-slate-700 -translate-y-1/2 z-0"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {steps.map((item, idx) => (
                <motion.div key={idx} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }} className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-white dark:bg-slate-800 border-2 border-[#2563EB] text-[#2563EB] font-bold text-lg rounded-full flex items-center justify-center shadow-lg relative">
                    <item.icon className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 text-[10px] bg-[#2563EB] text-white px-1.5 rounded-full">{item.number}</span>
                  </div>
                  <h4 className="mt-4 font-bold text-[#1E293B] dark:text-white">{item.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] text-center mt-1 px-4 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Genie AI Section */}
      <section className="py-20 bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:w-1/2 space-y-6 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold">Meet Your AI Study Genie</h2>
              <p className="text-blue-100/80 leading-relaxed text-base sm:text-lg">
                A magical AI tutor that understands you. No more late-night panic. Simply open StudyGenie and get broken-down steps.
              </p>
              <ul className="space-y-3 !list-none p-0 inline-block text-left mx-auto lg:mx-0">
                {["Saves 10+ hours of prep weekly", "24/7 dedicated support desk", "Matches your curriculum style"].map((el, i) => (
                  <li key={i} className="flex items-center space-x-2 text-blue-100/90 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:w-1/2 flex justify-center scale-90 sm:scale-100">
              <img 
                src={mascotImg} 
                alt="StudyGenie AI illustration" 
                className="w-72 h-72 sm:w-80 sm:h-80 object-contain rounded-3xl drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" 
              />



            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[var(--bg-secondary)] border-t border-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] dark:text-white">What Students Say</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div key={idx} className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-left shadow-sm">
                <div className="flex items-center space-x-1 text-[#F59E0B] mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />)}
                </div>
                <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center space-x-3">
                  <img src={t.img} className="w-9 h-9 rounded-full" alt="User avatar" />
                  <div>
                    <h5 className="font-bold text-xs text-[#1E293B] dark:text-white">{t.name}</h5>
                    <p className="text-[10px] text-[var(--text-secondary)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Study Smarter?</h2>
          <p className="mb-8 text-blue-100 text-sm sm:text-base">Join thousands of students and level up your grades effortlessly.</p>
          <Link to={session ? "/dashboard" : "/auth"} className="px-7 py-3 bg-white text-[#2563EB] font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2">
            <span>{session ? "Go to Dashboard" : "Start Learning Free"}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#020617] text-gray-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <img src="/logo_mascot_clean.png" alt="StudyGenie Logo" className="w-5 h-5 object-contain" />
              <span>StudyGenie</span>
            </div>
            <p className="mt-2 text-gray-500 leading-relaxed text-xs">Making learning magical for everyone, everywhere.</p>
          </div>
          {["Product", "Company", "Socials"].map((col, i) => (
            <div key={i}>
              <h6 className="text-white font-semibold text-xs mb-3">{col}</h6>
              <ul className="space-y-1.5 p-0 ">
                {col === "Product" && ["Features", "Pricing", "AI Tutor", "Extension"].map((l, j) => <li key={j}><a href="#" className="hover:text-blue-400">{l}</a></li>)}
                {col === "Company" && ["About", "Careers", "Contact", "Privacy"].map((l, j) => <li key={j}><a href="#" className="hover:text-blue-400">{l}</a></li>)}
                {col === "Socials" && ["Twitter", "LinkedIn", "Github"].map((l, j) => <li key={j}><a href="#" className="hover:text-blue-400">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-gray-800 text-center">
          &copy; {new Date().getFullYear()} StudyGenie. All rights reserved.
        </div>
      </footer>
    </div>
  );
}


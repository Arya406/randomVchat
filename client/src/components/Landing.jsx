import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Extremely lightweight, one-time animations to prevent lag
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

// Minimalist SVG Icons
const Icons = {
  Mic: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  ),
  Globe: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  ),
  Incognito: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M22 11v1a10 10 0 1 1-9-10" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  ),
  Fast: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
};

// Clean Feature Component (No shadows, no blurs)
function Feature({ icon, title, desc, index }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeUp}
      className="p-8 border border-neutral-200 bg-white rounded-2xl hover:border-neutral-400 transition-colors duration-200"
    >
      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white flex flex-col">
      
      {/* Navbar - Minimal */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neutral-900 rounded-md flex items-center justify-center text-white">
            {Icons.Mic}
          </div>
          <span className="text-xl font-bold tracking-tight">VibeTalk</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium text-neutral-500">
          <a href="#how-it-works" className="hover:text-neutral-900 transition-colors">How it works</a>
          <a href="#features" className="hover:text-neutral-900 transition-colors">Features</a>
        </div>
      </header>

      {/* Hero Section - High contrast, typography focused */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-4xl mx-auto w-full">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-600 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Strangers online now
        </motion.div>

        <motion.h1 
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.1] mb-6"
        >
          Talk to strangers. <br className="hidden md:block" />
          <span className="text-neutral-400">Keep it simple.</span>
        </motion.h1>

        <motion.p 
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-lg md:text-xl text-neutral-500 max-w-2xl mb-10"
        >
          No profiles, no cameras, no endless swiping. Just one click to start a real, anonymous voice conversation with someone new.
        </motion.p>

        <motion.button
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onClick={() => navigate("/chat")}
          className="group px-8 py-4 bg-neutral-900 text-white text-lg font-medium rounded-full hover:bg-neutral-800 transition-colors active:scale-[0.98] flex items-center gap-3"
        >
          {Icons.Mic} Start Chatting
          <span className="text-neutral-400 group-hover:text-white transition-colors">→</span>
        </motion.button>
      </main>

      {/* How it Works - Simple Step Text */}
      <section id="how-it-works" className="w-full bg-white border-y border-neutral-200 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center">How it works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Click Start", desc: "No signup required. Just hit the button." },
              { step: "02", title: "Instant Match", desc: "We connect you with a random stranger globally." },
              { step: "03", title: "Start Talking", desc: "Your mic is live. Enjoy the conversation." }
            ].map((item, i) => (
              <motion.div 
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="flex flex-col items-center text-center"
              >
                <span className="text-neutral-300 font-mono text-sm mb-4">{item.step}</span>
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-neutral-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Clean Grid */}
      <section id="features" className="w-full py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-12 text-center">Why VibeTalk?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Feature 
            index={0}
            icon={Icons.Globe} 
            title="Global Reach" 
            desc="Connect with people from completely different cultures and backgrounds in seconds." 
          />
          <Feature 
            index={1}
            icon={Icons.Incognito} 
            title="100% Anonymous" 
            desc="We don't collect your data. There are no profiles. Your identity stays totally private." 
          />
          <Feature 
            index={2}
            icon={Icons.Fast} 
            title="Zero Friction" 
            desc="Built for speed. A lightweight platform meaning instant connections and clear audio." 
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-6 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500 max-w-6xl mx-auto gap-4">
        <p>© {new Date().getFullYear()} VibeTalk. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-neutral-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-neutral-900 transition-colors">Terms</a>
        </div>
      </footer>

    </div>
  );
}

export default Landing;
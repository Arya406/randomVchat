import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

function Feature({ icon, title, desc }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={0}
      className="relative group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-md border border-gray-200/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
      <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-purple-200/50 transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
}

function Landing({ onStart }) {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-gray-900 flex flex-col overflow-x-hidden">

      {/* Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center px-6 md:px-10 py-4 border-b border-gray-100/80 bg-white/70 backdrop-blur-md sticky top-0 z-50"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          VibeTalk
        </h1>

        <button
          onClick={onStart}
          className="relative px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Start
        </button>
      </motion.header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center flex-1 px-6 py-24 md:py-32 relative">
        {/* Decorative background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight max-w-3xl bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent"
        >
          Talk to strangers. <br />
          Share random thoughts.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl"
        >
          A safe, anonymous space to connect worldwide. <br className="hidden sm:block" />
          No profiles. No pressure. Just real conversations.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          onClick={() => navigate("/chat")}
          className="mt-10 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2 group"
        >
          <span className="relative">
            🎙️
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-green-400 rounded-full animate-ping" />
          </span>
          Start Talking
        </motion.button>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-14"
          >
            How it works
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: "👆", title: "Click Start", desc: "Jump in with one tap. No registration needed." },
              { step: "2", icon: "🔗", title: "Get Matched", desc: "We instantly connect you with a random person." },
              { step: "3", icon: "💬", title: "Start Talking", desc: "Voice, text, or just vibe — your choice." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <span className="inline-block mb-3 text-xs font-bold tracking-wider text-purple-500 bg-purple-50 px-3 py-1 rounded-full">
                  STEP {item.step}
                </span>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-14"
          >
            Why VibeTalk?
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature icon="🌍" title="Global" desc="Meet people from every corner of the world instantly." />
            <Feature icon="🎧" title="Voice First" desc="Real conversations through voice for a human touch." />
            <Feature icon="⚡" title="Instant" desc="No signup, no waiting. One click and you’re connected." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 py-8 border-t border-gray-200/70 bg-white/40 backdrop-blur-sm">
        <p className="mb-1">Built for fun • Stay respectful • Stay anonymous</p>
        <p>© {new Date().getFullYear()} VibeTalk</p>
      </footer>
    </div>
  );
}

export default Landing;
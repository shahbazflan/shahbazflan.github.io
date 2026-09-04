import React, { useState } from 'react';
import { FeaturedShowreel } from './components/FeaturedShowreel';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0e1a]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-amber-400 flex items-center justify-center">
              <span className="text-black font-black text-sm">SF</span>
            </div>
            <span className="text-white font-bold text-lg">Shahbaz Flan</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#showreel" className="text-sm text-white/70 hover:text-white transition">
              Showreel
            </a>
            <a href="#contact" className="text-sm text-white/70 hover:text-white transition">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-montserrat font-black text-white mb-4 tracking-tight">
            Cinematic Synthesis
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light">
            AI-generated cinematography, motion design, and high-frequency kinetic typography for immersive screens.
          </p>
        </div>
      </section>

      {/* Featured Showreel Component */}
      <FeaturedShowreel isAdminMode={true} />

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 py-12 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center text-white/60">
          <p className="mb-4">Let's create something remarkable together.</p>
          <p className="text-sm">
            <a href="mailto:shahbazflan@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition">
              shahbazflan@gmail.com
            </a>
          </p>
          <p className="text-xs text-white/40 mt-6">© 2025 Shahbaz Flan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

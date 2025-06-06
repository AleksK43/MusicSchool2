import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const floatingElements = [
    { symbol: '♪', delay: 0, x: '10%', y: '20%' },
    { symbol: '♫', delay: 0.5, x: '85%', y: '15%' },
    { symbol: '♬', delay: 1, x: '15%', y: '70%' },
    { symbol: '♩', delay: 1.5, x: '80%', y: '75%' },
    { symbol: '♭', delay: 2, x: '50%', y: '10%' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-indigo-900/30" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Musical Notes */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              y: [0, -50, -100]
            }}
            transition={{
              duration: 8,
              delay: element.delay,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="absolute text-2xl text-blue-200/20"
            style={{ left: element.x, top: element.y }}
          >
            {element.symbol}
          </motion.div>
        ))}

        {/* Subtle Wave Pattern */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-32 opacity-10" 
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 1 }}
            fill="rgba(59, 130, 246, 0.1)"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-blue-300/80 text-lg font-light tracking-wide mb-6"
        >
          Odkryj swoją muzyczną duszę
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-5xl md:text-7xl font-extralight text-white mb-8 leading-tight"
        >
          Muzyka to
          <motion.span
            animate={{ 
              color: ['#ffffff', '#3b82f6', '#6366f1', '#ffffff']
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="block font-light italic"
          >
            język duszy
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-slate-300 text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          W Artyz łączymy tradycję z nowoczesnością. Nasze lekcje to podróż przez 
          soul, blues i rock - dla każdej kobiety, która chce wyrazić swoją wewnętrzną siłę przez muzykę.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-full font-light text-lg tracking-wide hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Rozpocznij podróż
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="border border-slate-400/30 text-slate-300 px-8 py-4 rounded-full font-light text-lg tracking-wide hover:bg-slate-800/30 hover:border-slate-300/50 transition-all duration-300 backdrop-blur-sm"
          >
            Posłuchaj próbek
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-slate-400/30 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-slate-400/50 rounded-full mt-2"></div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-2 h-16 bg-gradient-to-b from-blue-400/20 to-transparent rounded-full"></div>
      <div className="absolute top-1/3 right-16 w-1 h-12 bg-gradient-to-b from-indigo-400/20 to-transparent rounded-full"></div>
      <div className="absolute bottom-1/4 left-20 w-3 h-20 bg-gradient-to-b from-blue-300/10 to-transparent rounded-full"></div>
    </section>
  );
};

export default Hero;
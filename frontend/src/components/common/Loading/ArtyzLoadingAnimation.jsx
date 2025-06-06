import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ArtyzLoadingAnimation = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1500);
    const timer3 = setTimeout(() => setStage(3), 2500);
    const timer4 = setTimeout(() => setStage(4), 3500);
    const timer5 = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete && onComplete(), 800);
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  const noteVariants = {
    initial: { 
      scale: 0, 
      y: 50, 
      opacity: 0,
      rotate: -45 
    },
    animate: { 
      scale: 1, 
      y: 0, 
      opacity: 1,
      rotate: 0,
      transition: { 
        duration: 0.8,
        ease: [0.175, 0.885, 0.32, 1.275]
      }
    },
    float: {
      y: [-10, 10, -10],
      transition: { 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      y: -100,
      transition: { duration: 0.5 }
    }
  };

  const waveVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  const particleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i) => ({
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      x: Math.sin(i * 0.5) * 100,
      y: Math.cos(i * 0.3) * 80,
      transition: {
        duration: 2,
        delay: i * 0.1,
        repeat: Infinity,
        repeatDelay: 1
      }
    })
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          }}
        >
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={particleVariants}
                initial="initial"
                animate={stage >= 2 ? "animate" : "initial"}
                className="absolute w-1.5 h-1.5 bg-blue-400/20 rounded-full"
                style={{
                  left: `${20 + (i * 3) % 60}%`,
                  top: `${20 + (i * 7) % 60}%`
                }}
              />
            ))}
          </div>

          {/* Main Content Container */}
          <div className="relative z-10 text-center">
            
            {/* Musical Notes */}
            <div className="relative mb-8">
              <motion.div
                variants={noteVariants}
                initial="initial"
                animate={stage >= 1 ? ["animate", "float"] : "initial"}
                exit="exit"
                className="text-6xl mb-4 filter drop-shadow-sm"
              >
                🎵
              </motion.div>
              
              <motion.div
                variants={noteVariants}
                initial="initial"
                animate={stage >= 1 ? ["animate", "float"] : "initial"}
                exit="exit"
                className="absolute -top-4 -right-8 text-4xl text-blue-200/60"
                style={{ animationDelay: '0.2s' }}
              >
                🎶
              </motion.div>
              
              <motion.div
                variants={noteVariants}
                initial="initial"
                animate={stage >= 1 ? ["animate", "float"] : "initial"}
                exit="exit"
                className="absolute -bottom-4 -left-8 text-3xl text-indigo-200/50"
                style={{ animationDelay: '0.4s' }}
              >
                ♪
              </motion.div>
            </div>

            {/* Sound Waves */}
            {stage >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="mb-8"
              >
                <svg width="200" height="80" className="mx-auto">
                  <motion.path
                    variants={waveVariants}
                    initial="initial"
                    animate="animate"
                    d="M10,40 Q30,20 50,40 T90,40 T130,40 T170,40 T190,40"
                    stroke="rgba(59, 130, 246, 0.7)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <motion.path
                    variants={waveVariants}
                    initial="initial"
                    animate="animate"
                    d="M10,50 Q35,35 60,50 T110,50 T160,50 T190,50"
                    stroke="rgba(99, 102, 241, 0.5)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    style={{ animationDelay: '0.3s' }}
                  />
                  <motion.path
                    variants={waveVariants}
                    initial="initial"
                    animate="animate"
                    d="M10,30 Q40,15 70,30 T130,30 T190,30"
                    stroke="rgba(79, 70, 229, 0.3)"
                    strokeWidth="1"
                    fill="none"
                    strokeLinecap="round"
                    style={{ animationDelay: '0.6s' }}
                  />
                </svg>
              </motion.div>
            )}

            {/* Piano Keys Animation */}
            {stage >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="flex justify-center space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ 
                        delay: i * 0.1,
                        duration: 0.5,
                        ease: "backOut"
                      }}
                      className="w-8 h-16 bg-gradient-to-b from-slate-100 to-slate-200 rounded-b-lg shadow-sm origin-top border border-slate-300/20"
                    >
                      <motion.div
                        animate={{ 
                          backgroundColor: ['#f8fafc', '#3b82f6', '#6366f1', '#f8fafc'],
                        }}
                        transition={{ 
                          duration: 2.5,
                          delay: i * 0.12,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-full h-full rounded-b-lg"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Text Animation */}
            {stage >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <motion.h1
                  className="text-5xl font-light text-white mb-4"
                  animate={{ 
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    letterSpacing: '0.15em',
                    fontWeight: '300'
                  }}
                >
                  Artyz
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg text-slate-300/80 font-light tracking-wide"
                >
                  Szkoła Muzyczna
                </motion.p>

                {/* Loading dots */}
                <div className="flex justify-center space-x-2 mt-6">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-blue-300/60 rounded-full"
                      animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.2,
                        repeat: Infinity
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Floating Musical Symbols */}
            <div className="absolute inset-0 pointer-events-none">
              {['♫', '♪', '♬', '♩', '♭', '♯'].map((symbol, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={stage >= 2 ? {
                    opacity: [0, 0.4, 0],
                    scale: [0, 1, 0],
                    y: [100, -100],
                    x: Math.sin(i) * 100
                  } : {}}
                  transition={{
                    duration: 4,
                    delay: i * 0.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="absolute text-xl text-blue-200/20"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: '80%'
                  }}
                >
                  {symbol}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Subtle Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-indigo-900/10"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArtyzLoadingAnimation;
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../../../components/sections/Hero/Hero';
import Features from '../../../components/sections/Features/Features';
import About from '../About/About';
import Courses from '../Courses/Courses';
import Teachers from '../Teachers/Teachers';
import Contact from '../Contact/Contact';

const Home = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['home', 'about', 'courses', 'teachers', 'contact'].includes(hash)) {
      setCurrentPage(hash);
    } else {
      setCurrentPage('home');
    }
  }, [location.hash]);

  window.setHomeCurrentPage = setCurrentPage;

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'about':
        return <About />;
      case 'courses':
        return <Courses />;
      case 'teachers':
        return <Teachers />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <>
            <Hero />
            <Features />
            
            {/* About Section */}
            <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-4xl md:text-5xl font-extralight text-white mb-8">
                      Muzyka to więcej niż
                      <span className="text-blue-400 italic"> nauka</span>
                    </h2>
                    <p className="text-slate-300 text-lg font-light leading-relaxed mb-6">
                      W Artyz wierzymy, że każda kobieta ma w sobie unikalną muzyczną energię. 
                      Nasi doświadczeni instruktorzy pomogą Ci ją odkryć i rozwinąć, 
                      tworząc bezpieczną przestrzeń do ekspresji i wzrostu.
                    </p>
                    <p className="text-slate-300 text-lg font-light leading-relaxed mb-8">
                      Od subtelnych ballad soul po energetyczne riffy rockowe - 
                      znajdziemy razem Twój autentyczny głos muzyczny.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage('about')}
                      className="border border-blue-400/50 text-blue-300 px-8 py-3 rounded-full font-light tracking-wide hover:bg-blue-400/10 transition-all duration-300"
                    >
                      Poznaj naszą historię
                    </motion.button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="relative w-80 h-80 mx-auto">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-blue-400/20"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 rounded-full border border-indigo-400/15"
                      />
                      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="text-6xl mb-4"
                          >
                            🎵
                          </motion.div>
                          <p className="text-white font-light text-lg">
                            Twoja podróż<br />
                            <span className="text-blue-300">zaczyna się tutaj</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      animate={{ y: [-10, 10, -10] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute top-0 left-0 text-2xl text-blue-300/50"
                    >
                      ♪
                    </motion.div>
                    <motion.div
                      animate={{ y: [10, -10, 10] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="absolute bottom-0 right-0 text-xl text-indigo-300/50"
                    >
                      ♫
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
              <div className="container mx-auto px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl md:text-5xl font-extralight text-white mb-8">
                    Gotowa na muzyczną
                    <span className="text-blue-400 italic"> przygodę?</span>
                  </h2>
                  <p className="text-slate-300 text-xl font-light max-w-2xl mx-auto mb-12">
                    Dołącz do grona kobiet, które odkryły swoją muzyczną siłę w Artyz. 
                    Pierwsza lekcja jest bezpłatna!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-full font-light text-lg tracking-wide hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
                    >
                      Umów bezpłatną lekcję
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage('contact')}
                      className="border border-slate-400/30 text-slate-300 px-8 py-4 rounded-full font-light text-lg tracking-wide hover:bg-slate-800/30 hover:border-slate-300/50 transition-all duration-300"
                    >
                      Skontaktuj się z nami
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Usuń <Header onNavigate={handleNavigation} /> */}
      <main className="pt-20"> {/* Dodaj padding-top dla fixed header */}
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Home;
import React from 'react';
import { motion } from 'framer-motion';
import Header from '../../../components/common/Header/Header';

const About = ({ onNavigate }) => {
  const values = [
    {
      icon: '🎵',
      title: 'Uczeń w centrum',
      description: 'W Artyz najważniejszy jest uczeń. Jesteśmy pasjonatami nauczania, kochamy to robić i obserwować postępy naszych uczniów.',
      delay: 0.2
    },
    {
      icon: '✨',
      title: 'Bez presji czasu',
      description: 'Nauka daje rzetelny fundament i rozwija bez presji czasu i oczekiwań szybkich efektów. Wspieramy każdy krok Twojej podróży.',
      delay: 0.4
    },
    {
      icon: '🎯',
      title: 'Indywidualne podejście',
      description: 'Kadra zróżnicowana pod względem wieku, doświadczenia i specjalizacji. Znajdziesz nauczyciela idealnego dla swojego etapu nauki.',
      delay: 0.6
    },
    {
      icon: '🌟',
      title: 'Otwartość na potrzeby',
      description: 'Cechuje nas otwartość na potrzeby uczniów, chęć rozwoju i doskonalenia oraz pozytywne nastawienie do pracy.',
      delay: 0.8
    }
  ];

  const features = [
    {
      icon: '📱',
      title: 'Autorski Panel Klienta',
      description: 'Wgląd w przebieg zajęć, historię nauczania i bibliotekę multimedialną do uzupełniania wiedzy.'
    },
    {
      icon: '🎼',
      title: 'Wynajem instrumentów',
      description: 'Wspieramy początki nauki wynajmując instrumenty do domu: pianina, gitary, skrzypce, flety, saksofony.'
    },
    {
      icon: '🎓',
      title: 'Certyfikaty ABRSM',
      description: 'Jesteśmy placówką partnerską The Associated Board of the Royal Schools of Music - międzynarodowe egzaminy muzyczne.'
    },
    {
      icon: '🏠',
      title: 'Komfortowe wnętrza',
      description: 'Sale celowo pozbawione zbędnych rozpraszaczy uwagi, pozwalające na pełnię koncentracji podczas nauki.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <Header onNavigate={onNavigate} />
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-900 via-blue-900/20 to-indigo-900/30 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.1, 0],
                scale: [0, 1, 0],
                y: [100, -100]
              }}
              transition={{
                duration: 12,
                delay: i * 1.5,
                repeat: Infinity,
                repeatDelay: 5
              }}
              className="absolute text-4xl text-blue-200/10"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 30}%`
              }}
            >
              {['♪', '♫', '♬', '♩'][i % 4]}
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-extralight text-white mb-8 leading-tight"
              animate={{ 
                color: ['#ffffff', '#3b82f6', '#ffffff']
              }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              O nas
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed mb-12"
            >
              Artyz to szkoła muzyczna, w której najważniejszy jest uczeń. 
              Naszą misją jest przybliżanie człowieka do muzyki na każdym etapie życia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-block"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8">
                <p className="text-slate-200 text-lg font-light italic">
                  "Jesteśmy pasjonatami nauczania, kochamy to robić 
                  i obserwować postępy naszych uczniów"
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6">
              Nasze <span className="text-blue-400 italic">wartości</span>
            </h2>
            <p className="text-slate-300 text-xl font-light max-w-3xl mx-auto">
              Siedem fundamentów przyświeca naszemu podejściu do edukacji. 
              Pragniemy rozwijać ucznia poprzez muzykę, kształtując wartości i nawyki.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 group hover:bg-slate-800/70 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-5xl mb-6 inline-block"
                >
                  {value.icon}
                </motion.div>
                <h3 className="text-2xl font-light text-white mb-4 group-hover:text-blue-300 transition-colors">
                  {value.title}
                </h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6">
              Co nas <span className="text-blue-400 italic">wyróżnia</span>
            </h2>
            <p className="text-slate-300 text-xl font-light max-w-3xl mx-auto">
              Innowacyjne rozwiązania i autorskie podejście, które wyróżnia nas 
              na tle innych placówek muzycznych.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="text-4xl mb-6 group-hover:filter group-hover:drop-shadow-lg transition-all duration-300"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-light text-white mb-4 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Philosophy Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-8">
                Nasza <span className="text-blue-400 italic">kadra</span>
              </h2>
              <div className="space-y-6">
                <p className="text-slate-300 text-lg font-light leading-relaxed">
                  Cechuje ich otwartość na potrzeby swoich uczniów, chęć rozwoju i doskonalenia, 
                  aktywna działalność koncertowa oraz pozytywne nastawienie do swojej pracy.
                </p>
                <p className="text-slate-300 text-lg font-light leading-relaxed">
                  Cały zespół działa w zgodzie z naszymi zasadami, odcinając się od utartych 
                  stereotypów i sztampowego podejścia do nauczania.
                </p>
                <p className="text-slate-300 text-lg font-light leading-relaxed">
                  Masz szeroką możliwość wyboru nauczyciela, którego potrzebujesz 
                  akurat na tym etapie swojej edukacji muzycznej.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full h-80 bg-gradient-to-br from-slate-800/50 to-blue-900/30 rounded-2xl backdrop-blur-sm border border-slate-700/30 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🎭
                  </motion.div>
                  <p className="text-white font-light text-xl mb-2">
                    Różnorodność kadry
                  </p>
                  <p className="text-blue-300 text-sm">
                    Wiek • Doświadczenie • Specjalizacja
                  </p>
                </div>
              </div>

              {/* Floating elements around */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -left-4 text-2xl text-blue-300/50"
              >
                🎸
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 text-2xl text-indigo-300/50"
              >
                🎹
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.3)',
                  '0 0 40px rgba(99, 102, 241, 0.5)',
                  '0 0 20px rgba(59, 130, 246, 0.3)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="bg-gradient-to-br from-slate-800/70 to-blue-900/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12"
            >
              <h2 className="text-3xl md:text-4xl font-extralight text-white mb-8">
                Nasza misja
              </h2>
              <p className="text-xl md:text-2xl text-slate-200 font-light leading-relaxed italic mb-8">
                "Przybliżanie człowieka do muzyki na każdym etapie życia"
              </p>
              <p className="text-slate-300 text-lg font-light leading-relaxed">
                Nasi uczniowie czują nasze wsparcie, a efekty nauki i ich uśmiech 
                dają nam satysfakcję i napędzają do działania. To właśnie dlatego 
                tworzymy przestrzeń wolną od presji, pełną inspiracji i wzajemnego szacunku.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
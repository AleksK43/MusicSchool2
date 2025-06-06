import React from 'react';
import { motion } from 'framer-motion';
import Header from '../../../components/common/Header/Header';

const Courses = ({ onNavigate }) => {
  const courses = [
    {
      id: 1,
      icon: '🎤',
      title: 'Wokal & Śpiew',
      subtitle: 'Soul, Blues, Pop',
      description: 'Odkryj siłę swojego głosu. Techniki wokalne, interpretacja, sceniczna prezencja.',
      features: ['Technika oddychania', 'Interpretacja utworów', 'Występy sceniczne', 'Repertuar na miarę'],
      price: 'od 120 zł',
      duration: '45 min',
      level: 'Wszystkie poziomy',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 2,
      icon: '🎸',
      title: 'Gitara',
      subtitle: 'Klasyczna, Akustyczna, Elektryczna',
      description: 'Od delikatnych ballad po mocne riffy rockowe. Znajdź swój styl gry na gitarze.',
      features: ['Akordy i riffy', 'Fingerpicking', 'Solówki', 'Teoria muzyki'],
      price: 'od 110 zł',
      duration: '45 min',
      level: 'Początkujący - Zaawansowany',
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 3,
      icon: '🎹',
      title: 'Fortepian & Klawisze',
      subtitle: 'Klasyka, Jazz, Pop',
      description: 'Klasyczna elegancja spotyka nowoczesny sound. Fundament muzycznej edukacji.',
      features: ['Technika gry', 'Czytanie nut', 'Improwizacja', 'Aranżacja utworów'],
      price: 'od 130 zł',
      duration: '45 min',
      level: 'Wszystkie poziomy',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 4,
      icon: '🎻',
      title: 'Skrzypce',
      subtitle: 'Klasyczne & Współczesne',
      description: 'Instrument pełen emocji i wyrazu. Doskonały dla kobiecej ekspresji muzycznej.',
      features: ['Pozycja i trzymanie', 'Technika smyczka', 'Intonacja', 'Repertuar klasyczny'],
      price: 'od 140 zł',
      duration: '45 min',
      level: 'Początkujący - Średni',
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 5,
      icon: '🎷',
      title: 'Saksofon',
      subtitle: 'Jazz, Blues, Soul',
      description: 'Instrument pełen charakteru. Idealny do wyrażania emocji w stylu jazz i blues.',
      features: ['Technika dęta', 'Embouchure', 'Improwizacja jazzowa', 'Repertuar bluesowy'],
      price: 'od 135 zł',
      duration: '45 min',
      level: 'Początkujący - Zaawansowany',
      color: 'from-yellow-500 to-amber-600'
    },
    {
      id: 6,
      icon: '🎵',
      title: 'Rytmika dla dzieci',
      subtitle: 'Wiek 1,5 - 6 lat',
      description: 'Doremika i zajęcia gordonowskie. Wprowadzenie w świat muzyki przez zabawę.',
      features: ['Rozwój słuchu', 'Koordynacja ruchowa', 'Śpiew i zabawa', 'Instrumenty perkusyjne'],
      price: 'od 80 zł',
      duration: '30 min',
      level: 'Dzieci',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const benefits = [
    {
      icon: '🎯',
      title: 'Lekcja testowa za darmo',
      description: '30 minut bez zobowiązań. Poznaj nauczyciela i przekonaj się o trafności wyboru.'
    },
    {
      icon: '📱',
      title: 'Panel Klienta',
      description: 'Kalendarz, komunikator, materiały edukacyjne i opcja odwołania lekcji 24h/dobę.'
    },
    {
      icon: '🎼',
      title: 'Biblioteka e-book',
      description: 'Darmowy dostęp do nut dopasowanych do różnych poziomów trudności.'
    },
    {
      icon: '🏠',
      title: 'Wynajem instrumentów',
      description: 'Pianina, gitary, skrzypce - nie musisz inwestować w drogie instrumenty na start.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      <Header onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-900 via-blue-900/20 to-indigo-900/30 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.1, 0],
                scale: [0, 1, 0],
                y: [100, -100]
              }}
              transition={{
                duration: 10,
                delay: i * 1.2,
                repeat: Infinity,
                repeatDelay: 4
              }}
              className="absolute text-3xl text-blue-200/10"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`
              }}
            >
              {['🎵', '🎶', '♪', '♫'][i % 4]}
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
              Nasze kursy
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed mb-12"
            >
              Przybliżamy do muzyki na każdym etapie życia. 
              Znajdź instrument, który pozwoli Ci wyrazić swoją duszę.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-block"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8">
                <p className="text-slate-200 text-lg font-light italic">
                  "Dla dzieci, młodzieży i dorosłych. Lekcje indywidualne i grupowe. 
                  Pierwsza lekcja bez zobowiązań!"
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
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
              Wybierz swój <span className="text-blue-400 italic">instrument</span>
            </h2>
            <p className="text-slate-300 text-xl font-light max-w-3xl mx-auto">
              Każdy kurs dostosowany do Twojego poziomu i potrzeb. 
              Poznaj kwalifikacje nauczycieli i wybierz idealnego dla siebie.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {courses.map((course) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 h-full hover:bg-slate-800/70 transition-all duration-300 overflow-hidden">
                  {/* Gradient overlay */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${course.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="text-5xl mb-6 inline-block"
                  >
                    {course.icon}
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-light text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {course.title}
                  </h3>
                  <p className="text-blue-400 text-sm font-light mb-4">
                    {course.subtitle}
                  </p>
                  <p className="text-slate-400 font-light leading-relaxed mb-6">
                    {course.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {course.features.map((feature, index) => (
                      <li key={index} className="text-slate-300 text-sm flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Course details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Cena:</span>
                      <span className="text-white font-medium">{course.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Czas lekcji:</span>
                      <span className="text-white">{course.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Poziom:</span>
                      <span className="text-white">{course.level}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full bg-gradient-to-r ${course.color} text-white py-3 rounded-lg font-light tracking-wide hover:shadow-lg transition-all duration-300`}
                  >
                    Umów lekcję testową
                  </motion.button>

                  {/* Hover effect line */}
                  <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r ${course.color} group-hover:w-full transition-all duration-500`}></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Więcej niż tylko <span className="text-blue-400 italic">lekcje</span>
            </h2>
            <p className="text-slate-300 text-xl font-light max-w-3xl mx-auto">
              W cenie kursu otrzymasz szeroki zakres wsparcia dydaktycznego 
              i innowacyjnych rozwiązań.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
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
                  {benefit.icon}
                </motion.div>
                <h3 className="text-xl font-light text-white mb-4 group-hover:text-blue-300 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
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
              Zacznij swoją muzyczną
              <span className="text-blue-400 italic"> podróż</span>
            </h2>
            <p className="text-slate-300 text-xl font-light max-w-2xl mx-auto mb-12">
              Pierwsza lekcja jest bezpłatna i trwa 30 minut. 
              Nie niesie za sobą żadnych zobowiązań.
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
                onClick={() => onNavigate('teachers')}
                className="border border-slate-400/30 text-slate-300 px-8 py-4 rounded-full font-light text-lg tracking-wide hover:bg-slate-800/30 hover:border-slate-300/50 transition-all duration-300"
              >
                Poznaj nauczycieli
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
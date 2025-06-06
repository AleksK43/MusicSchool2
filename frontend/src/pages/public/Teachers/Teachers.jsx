import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../../components/common/Header/Header';

const Teachers = ({ onNavigate }) => {
  const [selectedInstrument, setSelectedInstrument] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const instruments = [
    { key: 'all', name: 'Wszyscy', icon: '🎵' },
    { key: 'vocal', name: 'Wokal', icon: '🎤' },
    { key: 'guitar', name: 'Gitara', icon: '🎸' },
    { key: 'piano', name: 'Fortepian', icon: '🎹' },
    { key: 'violin', name: 'Skrzypce', icon: '🎻' },
    { key: 'saxophone', name: 'Saksofon', icon: '🎷' },
  ];

  const teachers = [
    {
      id: 1,
      name: 'Anna Kowalska',
      instrument: 'vocal',
      specialization: 'Wokal Soul & Blues',
      experience: '8 lat doświadczenia',
      education: 'Akademia Muzyczna w Warszawie',
      description: 'Specjalistka w zakresie wokalistyki soul i blues. Pomaga uczniom odkryć unikalny charakter ich głosu.',
      achievements: ['Laureatka konkursu Jazz Vocals 2019', 'Współpraca z zespołem Blue Note', 'Wykładowca na warsztatach wokalnych'],
      price: '140 zł/45min',
      avatar: '👩‍🎤',
      style: 'Soul, Blues, Jazz',
      personality: 'Cierpliwa, motywująca, kreatywna'
    },
    {
      id: 2,
      name: 'Magdalena Nowak',
      instrument: 'piano',
      specialization: 'Fortepian Klasyczny & Jazz',
      experience: '12 lat doświadczenia',
      education: 'Chopin University of Music',
      description: 'Pianistka z klasycznym wykształceniem, która łączy tradycję z nowoczesnością w nauczaniu.',
      achievements: ['Koncerty w Filharmonii Narodowej', 'Nagroda na Konkursie Chopinowskim', 'Autorka metod nauczania dzieci'],
      price: '150 zł/45min',
      avatar: '👩‍🏫',
      style: 'Klasyka, Jazz, Contemporary',
      personality: 'Profesjonalna, wymagająca, wspierająca'
    },
    {
      id: 3,
      name: 'Karolina Zielińska',
      instrument: 'guitar',
      specialization: 'Gitara Akustyczna & Elektryczna',
      experience: '6 lat doświadczenia',
      education: 'Berklee College of Music (online)',
      description: 'Gitarzystka rockowa z pasją do nauczania kobiet. Specjalizuje się w nowoczesnych technikach gry.',
      achievements: ['Gitarzystka zespołu Electric Dreams', 'Warsztaty "Guitar for Women"', 'Nagrania studyjne dla innych artystów'],
      price: '120 zł/45min',
      avatar: '👩‍🎸',
      style: 'Rock, Pop, Alternative',
      personality: 'Energiczna, nowoczesna, inspirująca'
    },
    {
      id: 4,
      name: 'Agnieszka Wiśniewska',
      instrument: 'violin',
      specialization: 'Skrzypce Klasyczne',
      experience: '15 lat doświadczenia',
      education: 'Akademia Muzyczna im. Karola Szymanowskiego',
      description: 'Doświadczona skrzypaczka z klasycznym wykształceniem. Specjalizuje się w pracy z początkującymi.',
      achievements: ['Solista orkiestry kameralnej', 'Pedagog roku 2020', 'Autorka podręcznika dla dzieci'],
      price: '160 zł/45min',
      avatar: '👩‍🎓',
      style: 'Klasyka, Folk, Contemporary',
      personality: 'Precyzyjna, cierpliwa, metodyczna'
    },
    {
      id: 5,
      name: 'Monika Brzezińska',
      instrument: 'saxophone',
      specialization: 'Saksofon Jazz & Blues',
      experience: '10 lat doświadczenia',
      education: 'Jazz Institute Berlin',
      description: 'Saksofonistka jazzowa z międzynarodowym doświadczeniem. Uczy improwizacji i ekspresji muzycznej.',
      achievements: ['Występy na festiwalach jazzowych', 'Nagrania z międzynarodowymi artystami', 'Mentorka młodych muzyków'],
      price: '145 zł/45min',
      avatar: '👩‍🎶',
      style: 'Jazz, Blues, Funk',
      personality: 'Spontaniczna, pasjonująca, otwarta'
    },
    {
      id: 6,
      name: 'Joanna Kaczmarek',
      instrument: 'guitar',
      specialization: 'Gitara Klasyczna',
      experience: '9 lat doświadczenia',
      education: 'Akademia Muzyczna w Krakowie',
      description: 'Klasyczna gitarzystka z delikatnym podejściem do nauczania. Idealna dla osób ceniących spokój i precyzję.',
      achievements: ['Recitale gitarowe w całej Polsce', 'Nagrania dla radia klasycznego', 'Wykładowca technik relaksacyjnych'],
      price: '135 zł/45min',
      avatar: '👩‍🎼',
      style: 'Klasyka, Fingerstyle, Bossa Nova',
      personality: 'Spokojna, precyzyjna, medytacyjna'
    }
  ];

  const filteredTeachers = selectedInstrument === 'all' 
    ? teachers 
    : teachers.filter(teacher => teacher.instrument === selectedInstrument);

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
              Nasi nauczyciele
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed mb-12"
            >
              Poznaj kompetencje, doświadczenie i charyzmę naszych pedagogów. 
              Wybierz nauczyciela idealnego dla Twojego stylu nauki.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-light text-white mb-8">
              Filtruj według <span className="text-blue-400 italic">instrumentu</span>
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4">
              {instruments.map((instrument) => (
                <motion.button
                  key={instrument.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedInstrument(instrument.key)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-light tracking-wide transition-all duration-300 ${
                    selectedInstrument === instrument.key
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{instrument.icon}</span>
                  <span>{instrument.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedInstrument}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredTeachers.map((teacher) => (
                <motion.div
                  key={teacher.id}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={() => setSelectedTeacher(teacher)}
                  className="group relative cursor-pointer"
                >
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 h-full hover:bg-slate-800/70 transition-all duration-300">
                    {/* Avatar & Header */}
                    <div className="text-center mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="text-6xl mb-4 inline-block"
                      >
                        {teacher.avatar}
                      </motion.div>
                      <h3 className="text-2xl font-light text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                        {teacher.name}
                      </h3>
                      <p className="text-blue-400 text-sm font-light mb-2">
                        {teacher.specialization}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {teacher.experience}
                      </p>
                    </div>

                    {/* Quick Info */}
                    <div className="space-y-3 mb-6">
                      <div className="text-sm">
                        <span className="text-slate-400">Wykształcenie:</span>
                        <p className="text-slate-300 font-light">{teacher.education}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Styl:</span>
                        <p className="text-slate-300 font-light">{teacher.style}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Osobowość:</span>
                        <p className="text-slate-300 font-light">{teacher.personality}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <span className="text-2xl font-light text-white">{teacher.price}</span>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-light tracking-wide hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                      >
                        Umów lekcję testową
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeacher(teacher);
                        }}
                        className="w-full border border-slate-600/50 text-slate-300 py-3 rounded-lg font-light tracking-wide hover:bg-slate-700/30 transition-all duration-300"
                      >
                        Zobacz profil
                      </motion.button>
                    </div>

                    {/* Hover effect line */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:w-full transition-all duration-500"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Teacher Modal */}
      <AnimatePresence>
        {selectedTeacher && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedTeacher(null)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">{selectedTeacher.avatar}</div>
                    <div>
                      <h2 className="text-3xl font-light text-white">{selectedTeacher.name}</h2>
                      <p className="text-blue-400">{selectedTeacher.specialization}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedTeacher(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-light text-white mb-3">O nauczycielu</h3>
                    <p className="text-slate-300 leading-relaxed">{selectedTeacher.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-light text-white mb-3">Wykształcenie</h3>
                    <p className="text-slate-300">{selectedTeacher.education}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-light text-white mb-3">Osiągnięcia</h3>
                    <ul className="space-y-2">
                      {selectedTeacher.achievements.map((achievement, index) => (
                        <li key={index} className="text-slate-300 flex items-start">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-lg font-light text-white mb-2">Styl muzyczny</h4>
                      <p className="text-slate-300">{selectedTeacher.style}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-light text-white mb-2">Cena lekcji</h4>
                      <p className="text-slate-300 text-xl font-medium">{selectedTeacher.price}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-700/50">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-lg font-light text-lg tracking-wide hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Umów bezpłatną lekcję testową z {selectedTeacher.name.split(' ')[0]}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Philosophy Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extralight text-white mb-8">
              Nasza filozofia <span className="text-blue-400 italic">nauczania</span>
            </h2>
            <p className="text-slate-300 text-xl font-light max-w-3xl mx-auto mb-12">
              Nasi pedagodzy realizują misję Artyz - otwartość na potrzeby uczniów, 
              chęć rozwoju i pozytywne nastawienie do pracy. Kadra zróżnicowana pod względem 
              wieku, doświadczenia i specjalizacji.
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
                onClick={() => onNavigate('courses')}
                className="border border-slate-400/30 text-slate-300 px-8 py-4 rounded-full font-light text-lg tracking-wide hover:bg-slate-800/30 hover:border-slate-300/50 transition-all duration-300"
              >
                Zobacz nasze kursy
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Teachers;
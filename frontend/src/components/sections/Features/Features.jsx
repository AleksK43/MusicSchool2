import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: '🎤',
      title: 'Wokal Soul & Blues',
      description: 'Odkryj głębię swojego głosu. Nauka technik wokalnych w stylu legendy blues i soul.',
      delay: 0.2
    },
    {
      icon: '🎸',
      title: 'Gitara Rockowa',
      description: 'Od delikatnych ballad po mocne riffy. Wyrażaj swoje emocje przez struny.',
      delay: 0.4
    },
    {
      icon: '🎹',
      title: 'Fortepian & Klawisze',
      description: 'Klasyczna elegancja spotyka nowoczesny sound. Fundament każdej muzycznej podróży.',
      delay: 0.6
    },
    {
      icon: '✨',
      title: 'Aranżacja & Kompozycja',
      description: 'Twórz własne utwory. Naucz się układać muzykę, która opowie Twoją historię.',
      delay: 0.8
    },
    {
      icon: '🎵',
      title: 'Zespoły & Jamy',
      description: 'Graj z innymi. Doświadcz magii współtworzenia muzyki w grupie.',
      delay: 1.0
    },
    {
      icon: '🎧',
      title: 'Produkcja Muzyczna',
      description: 'Nagrywaj i produkuj własne utwory. Technologia w służbie Twojej kreatywności.',
      delay: 1.2
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6">
            Znajdź swój
            <span className="text-blue-400 italic"> dźwięk</span>
          </h2>
          <p className="text-slate-300 text-xl font-light max-w-2xl mx-auto">
            W Artyz każda kobieta może odkryć swoją unikalną muzyczną ścieżkę. 
            Oferujemy różnorodne kursy dopasowane do Twojego stylu i poziomu.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              {/* Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 h-full hover:bg-slate-800/70 transition-all duration-300">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-4xl mb-6 inline-block"
                >
                  {feature.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-light text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:w-full transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-full font-light text-lg tracking-wide hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Zobacz wszystkie kursy
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
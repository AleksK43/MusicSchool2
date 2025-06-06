import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../../components/common/Header/Header';

const Contact = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    instrument: '',
    message: '',
    preferredContact: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const instruments = [
    'Wokal', 'Gitara', 'Fortepian', 'Skrzypce', 'Saksofon', 'Rytmika dla dzieci', 'Inne'
  ];

  const locations = [
    {
      city: 'Warszawa',
      address: 'ul. Przykładowa 15',
      phone: '+48 22 123 45 67',
      email: 'warszawa@artyz.pl',
      hours: 'Pn-Pt: 9:00-20:00, Sb: 10:00-16:00',
      icon: '🏢'
    },
    {
      city: 'Kraków',
      address: 'ul. Floriańska 25',
      phone: '+48 12 234 56 78',
      email: 'krakow@artyz.pl',
      hours: 'Pn-Pt: 9:00-20:00, Sb: 10:00-16:00',
      icon: '🎭'
    },
    {
      city: 'Poznań',
      address: 'ul. Piękna 51',
      phone: '+48 61 345 67 89',
      email: 'poznan@artyz.pl',
      hours: 'Pn-Pt: 9:00-20:00, Sb: 10:00-16:00',
      icon: '🦆'
    }
  ];

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email',
      value: 'kontakt@artyz.pl',
      description: 'Napisz do nas, odpowiemy w ciągu 24h'
    },
    {
      icon: '📞',
      title: 'Telefon',
      value: '+48 800 123 456',
      description: 'Zadzwoń w godzinach 9:00-18:00'
    },
    {
      icon: '💬',
      title: 'WhatsApp',
      value: '+48 123 456 789',
      description: 'Szybki kontakt przez WhatsApp'
    },
    {
      icon: '📱',
      title: 'Messenger',
      value: '@ArtyzSzkolaMuzyczna',
      description: 'Pisz na Facebooku'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Symulacja wysłania formularza
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Dziękujemy za wiadomość! Skontaktujemy się z Tobą w ciągu 24 godzin.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        instrument: '',
        message: '',
        preferredContact: 'email'
      });
    }, 1000);
  };

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
          {[...Array(5)].map((_, i) => (
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
                delay: i * 2,
                repeat: Infinity,
                repeatDelay: 6
              }}
              className="absolute text-4xl text-blue-200/10"
              style={{
                left: `${20 + i * 20}%`,
                top: `${25 + (i % 2) * 30}%`
              }}
            >
              {['📧', '📞', '💬', '🎵'][i % 4]}
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
              Skontaktuj się z nami
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed mb-12"
            >
              Masz pytania? Chcesz umówić lekcję testową? 
              Skontaktuj się z nami - odpowiemy w ciągu 24 godzin.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-block"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8">
                <p className="text-slate-200 text-lg font-light italic">
                  "Pierwsza lekcja testowa jest bezpłatna i trwa 30 minut. 
                  Umów się już dziś!"
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24 bg-slate-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6">
              Sposoby <span className="text-blue-400 italic">kontaktu</span>
            </h2>
            <p className="text-slate-300 text-xl font-light max-w-3xl mx-auto">
              Wybierz najwygodniejszy dla Ciebie sposób kontaktu. 
              Jesteśmy dostępni przez cały dzień roboczych.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group"
              >
                <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 text-center hover:bg-slate-700/70 transition-all duration-300">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="text-4xl mb-4"
                  >
                    {method.icon}
                  </motion.div>
                  <h3 className="text-xl font-light text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-blue-400 font-medium mb-2">
                    {method.value}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {method.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Locations */}
      <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-light text-white mb-8">
                Napisz do <span className="text-blue-400 italic">nas</span>
              </h3>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8">
                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-light mb-2">
                        Imię *
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                        placeholder="Twoje imię"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-light mb-2">
                        Nazwisko *
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                        placeholder="Twoje nazwisko"
                      />
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-light mb-2">
                        Email *
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                        placeholder="twoj@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-light mb-2">
                        Telefon
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                        placeholder="+48 123 456 789"
                      />
                    </div>
                  </div>

                  {/* Instrument */}
                  <div>
                    <label className="block text-slate-300 text-sm font-light mb-2">
                      Interesujący Cię instrument
                    </label>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      name="instrument"
                      value={formData.instrument}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                    >
                      <option value="">Wybierz instrument</option>
                      {instruments.map((instrument) => (
                        <option key={instrument} value={instrument} className="bg-slate-800">
                          {instrument}
                        </option>
                      ))}
                    </motion.select>
                  </div>

                  {/* Preferred Contact */}
                  <div>
                    <label className="block text-slate-300 text-sm font-light mb-2">
                      Preferowany sposób kontaktu
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="email"
                          checked={formData.preferredContact === 'email'}
                          onChange={handleInputChange}
                          className="text-blue-500 focus:ring-blue-400"
                        />
                        <span className="ml-2 text-slate-300">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="phone"
                          checked={formData.preferredContact === 'phone'}
                          onChange={handleInputChange}
                          className="text-blue-500 focus:ring-blue-400"
                        />
                        <span className="ml-2 text-slate-300">Telefon</span>
                      </label>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-slate-300 text-sm font-light mb-2">
                      Wiadomość
                    </label>
                    <motion.textarea
                      whileFocus={{ scale: 1.02 }}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300 resize-none"
                      placeholder="Opisz swoje potrzeby, poziom zaawansowania lub zadaj pytanie..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-lg font-light text-lg tracking-wide hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                        />
                        Wysyłanie...
                      </div>
                    ) : (
                      'Wyślij wiadomość'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Locations */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-light text-white mb-8">
                Nasze <span className="text-blue-400 italic">placówki</span>
              </h3>

              <div className="space-y-6">
                {locations.map((location, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="text-3xl"
                      >
                        {location.icon}
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-xl font-light text-white mb-2">
                          {location.city}
                        </h4>
                        <div className="space-y-2 text-sm text-slate-300">
                          <p><span className="text-slate-400">Adres:</span> {location.address}</p>
                          <p><span className="text-slate-400">Telefon:</span> {location.phone}</p>
                          <p><span className="text-slate-400">Email:</span> {location.email}</p>
                          <p><span className="text-slate-400">Godziny:</span> {location.hours}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Contact */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="mt-8 p-6 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl border border-blue-500/20"
              >
                <h4 className="text-lg font-light text-white mb-4">
                  Szybki kontakt
                </h4>
                <p className="text-slate-300 text-sm mb-4">
                  Potrzebujesz natychmiastowej odpowiedzi? Zadzwoń lub napisz na WhatsApp.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-300"
                  >
                    📱 WhatsApp
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-300"
                  >
                    📞 Zadzwoń
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6">
              Często zadawane <span className="text-blue-400 italic">pytania</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                q: "Czy pierwsza lekcja jest naprawdę bezpłatna?",
                a: "Tak! Pierwsza lekcja testowa trwa 30 minut i jest całkowicie bezpłatna. Nie niesie za sobą żadnych zobowiązań."
              },
              {
                q: "Czy muszę mieć własny instrument?",
                a: "Nie! Oferujemy wynajem instrumentów w przystępnych cenach. W szkole mamy wszystkie potrzebne instrumenty do nauki."
              },
              {
                q: "Jak długo trwa lekcja?",
                a: "Standardowa lekcja trwa 45 minut. Dla najmłodszych dzieci oferujemy lekcje 30-minutowe."
              },
              {
                q: "Czy podpisujemy umowę?",
                a: "Nie! W Artyz nie podpisujemy długoterminowych umów. Płacisz miesięcznie jak za subskrypcję."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6"
              >
                <h4 className="text-lg font-light text-white mb-3">
                  {faq.q}
                </h4>
                <p className="text-slate-300 font-light leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
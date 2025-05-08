'use client';

import { motion } from 'framer-motion';

const yonetimKadrosu = [
  {
    isim: "Ömer Öksüzaşıkı",
    pozisyon: "BalıZ Parmak Kulübü Başkanı",
    foto: "/images/yonetim/1.jpg",
    linkedin: "https://www.linkedin.com/in/%C3%B6mer-%C3%B6ks%C3%BCza%C5%9F%C4%B1k%C4%B1-b364b9329?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    hiyerarsi: 1
  },
  {
    isim: "Furkan Selim Gönç",
    pozisyon: "Başkan Yardımcısı",
    foto: "/images/yonetim/2.jpeg",
    linkedin: "https://www.linkedin.com/in/furkan-selim-g%C3%B6n%C3%A7-a832b430a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    hiyerarsi: 2
  },
  {
    isim: "Halise Akkurt",
    pozisyon: "Sayman",
    foto: "/images/yonetim/3.jpeg",
    linkedin: "https://www.linkedin.com/in/halise-akkurt-975b152a5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    hiyerarsi: 2
  },
  {
    isim: "Beyazıt Can Eytemiş ",
    pozisyon: "Yazman",
    foto: "/images/yonetim/4.jpeg",
    linkedin: "https://www.linkedin.com/in/beyaz%C4%B1t-can-eytemi%C5%9F-a49853340?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    hiyerarsi: 2
  },
  {
    isim: "Kevser Yayuspayı",
    pozisyon: "Yönetim Kurulu Üyesi",
    foto: "/images/yonetim/5.jpeg",
    linkedin: "https://www.linkedin.com/in/kevser-yayuspay%C4%B1-59aa29346?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    hiyerarsi: 3
  },
  {
    isim: "Umut Çabuk",
    pozisyon: "Yönetim Kurulu Üyesi",
    foto: "/images/yonetim/6.jpeg",
    linkedin: "https://www.linkedin.com/in/umut-%C3%A7abuk-75a792342?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    hiyerarsi: 3
  },
  {
    isim: "Maide Benli",
    pozisyon: "Yönetim Kurulu Üyesi",
    foto: "/images/yonetim/7.jpeg",
    linkedin: "https://www.linkedin.com/in/maide-benli-1257a8343?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    hiyerarsi: 3
  },
  {
    isim: "Semanur Kurşun",
    pozisyon: "Yönetim Kurulu Üyesi",
    foto: "/images/yonetim/8.jpeg",
    linkedin: "https://www.linkedin.com/in/semanur-kur%C5%9Fun-a63a2728b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    hiyerarsi: 3
  },
  {
    isim: "Ulaş Yıldıray Keleş ",
    pozisyon: "Yönetim Kurulu Üyesi",
    foto: "/images/yonetim/9.jpeg",
    linkedin: "https://www.linkedin.com/in/ula%C5%9F-y%C4%B1ld%C4%B1ray-kele%C5%9F-39709b24a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    hiyerarsi: 3
  },
  {
    isim: "Mert Benli",
    pozisyon: "Yönetim Kurulu Üyesi",
    foto: "/images/yonetim/10.jpeg",
    linkedin: "https://www.linkedin.com/in/mert-benli-bb5a89347?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    hiyerarsi: 3
  }
];

export default function YonetimPage() {
  // Yöneticileri hiyerarşiye göre grupla
  const baskan = yonetimKadrosu.find(y => y.hiyerarsi === 1);
  const ustYonetim = yonetimKadrosu.filter(y => y.hiyerarsi === 2);
  const digerUyeler = yonetimKadrosu.filter(y => y.hiyerarsi === 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-amber-800 mb-4">Yönetim Kadromuz</h1>
          <p className="text-amber-600 max-w-2xl mx-auto">
            Çukurova Üniversitesi BalıZ Parmak Kulübü'nü başarıyla yöneten değerli yöneticilerimiz
          </p>
        </motion.div>

        {/* Başkan */}
        <div className="max-w-md mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-80">
              <img
                src={baskan.foto}
                alt={baskan.isim}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white">{baskan.isim}</h3>
                <p className="text-amber-200 text-lg">{baskan.pozisyon}</p>
              </div>
            </div>
            <div className="p-6">
              <a
                href={baskan.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-amber-600 hover:text-amber-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
                </svg>
                LinkedIn Profili
              </a>
            </div>
          </motion.div>
        </div>

        {/* Üst Yönetim */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {ustYonetim.map((yonetici, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <img
                  src={yonetici.foto}
                  alt={yonetici.isim}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">{yonetici.isim}</h3>
                  <p className="text-amber-200">{yonetici.pozisyon}</p>
                </div>
              </div>
              <div className="p-4">
                <a
                  href={yonetici.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-amber-600 hover:text-amber-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
                  </svg>
                  LinkedIn Profili
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Diğer Üyeler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {digerUyeler.map((yonetici, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <img
                  src={yonetici.foto}
                  alt={yonetici.isim}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">{yonetici.isim}</h3>
                  <p className="text-amber-200">{yonetici.pozisyon}</p>
                </div>
              </div>
              <div className="p-4">
                <a
                  href={yonetici.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-amber-600 hover:text-amber-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
                  </svg>
                  LinkedIn Profili
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Suspense } from 'react';
import AnnouncementsList from '@/components/AnnouncementsList';
import VideosList from '@/components/VideosList';
import Loading from '@/components/Loading';

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Duyuruları API'den çek
    async function fetchAnnouncements() {
      try {
        setLoading(true);
        const response = await fetch('/api/announcements');
        
        // Duyuruları localStorage'dan kontrol et (yedek olarak)
        const localStorageAnnouncements = localStorage.getItem("announcements");
        
        if (!response.ok) {
          // API çağrısı başarısız olursa localStorage'a düş
          if (localStorageAnnouncements) {
            const parsed = JSON.parse(localStorageAnnouncements);
            if (parsed.length === 0) {
              localStorage.removeItem("announcements");
              setAnnouncements([]);
            } else {
              setAnnouncements(parsed);
            }
            setError("");
          } else {
            setError("Duyurular yüklenirken bir hata oluştu");
          }
          return;
        }
        
        const data = await response.json();
        
        if (data && data.announcements && data.announcements.length > 0) {
          setAnnouncements(data.announcements);
          // localStorage'ı da güncelle
          localStorage.setItem("announcements", JSON.stringify(data.announcements));
        } else if (localStorageAnnouncements) {
          // API'den veri gelmezse localStorage'a düş
          const parsed = JSON.parse(localStorageAnnouncements);
          if (parsed.length === 0) {
            localStorage.removeItem("announcements");
            setAnnouncements([]);
          } else {
            setAnnouncements(parsed);
          }
        } else {
          setAnnouncements([]);
        }
        
        setError("");
      } catch (err) {
        console.error("Duyurular çekilirken hata:", err);
        
        // Hata durumunda localStorage'a düş
        const localStorageAnnouncements = localStorage.getItem("announcements");
        if (localStorageAnnouncements) {
          const parsed = JSON.parse(localStorageAnnouncements);
          if (parsed.length === 0) {
            localStorage.removeItem("announcements");
            setAnnouncements([]);
          } else {
            setAnnouncements(parsed);
          }
          setError("");
        } else {
          setError("Duyurular yüklenirken bir hata oluştu");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative bg-amber-600 text-white py-20">
        <div className="absolute inset-0 bg-amber-800 opacity-20 pattern-honeycomb pattern-amber-700 pattern-bg-transparent pattern-size-6 pattern-opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">BALİZ PARMAK KULÜBÜ</h1>
            <p className="text-xl mb-8">Çukurova Üniversitesi'nde engelleri aşan, ilham veren öğrenci kulübü</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* Butonlar kaldırıldı */}
            </div>
          </div>
        </div>
      </section>

      {/* Ana içerik */}
      <main className="container mx-auto px-4 py-12">
        {/* Tanıtım Bölümü */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 -mt-8 -mr-8 bg-amber-300 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 -mb-8 -ml-8 bg-amber-300 rounded-full opacity-20"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center">Biz Kimiz?</h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Çukurova Üniversitesi BalİZ Parmak Kulübü, bireylerin karşılaştığı fiziksel, sosyal ve psikolojik engelleri aşmalarına destek olmayı hedefleyen, ilham veren bir öğrenci kulübüdür. Çukurova Üniversitesi'nin değer üreten topluluklarından biri olan BalİZ Parmak, kapsayıcılığı ve farkındalığı merkezine alarak öğrencilerin kişisel ve sosyal gelişimlerine katkı sağlamaktadır.
            </p>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2">
                <h3 className="text-xl font-bold text-amber-700 mb-3">Vizyonumuz</h3>
                <p className="text-gray-700 mb-6 italic border-l-4 border-amber-500 pl-4 py-2">
                  &quot;Herkesin potansiyelini istediği şekilde gerçekleştirebildiği; engellerin değil, hayallerin konuşulduğu bir birliktelik oluşturmaktır.&quot;
                </p>
                
                <h3 className="text-xl font-bold text-amber-700 mb-3">Misyonumuz</h3>
                <p className="text-gray-700 mb-2">
                  Sosyal, kültürel ve fiziksel engelleri aşmak için farkındalık yaratmak, kapsayıcı projeler geliştirmektir.
                </p>
                <p className="text-gray-700">
                  BalİZ Parmak, yalnızca bireysel gelişimi değil; aynı zamanda toplumun genelinde empati, dayanışma ve erişilebilirlik kültürünü yaygınlaştırmayı amaçlar.
                </p>
              </div>
              
              <div className="w-full md:w-1/2 relative mt-8 md:mt-0">
                <div className="w-full h-48 sm:h-64 md:h-80 relative bg-amber-100 rounded-lg overflow-hidden shadow-lg flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-amber-200 opacity-50 pattern-honeycomb pattern-amber-500 pattern-bg-transparent pattern-size-4"></div>
                  <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-6">
                    <img src="/baliz.jpg" alt="Baliz Parmak Kulübü Logosu" className="w-full max-w-xs h-32 sm:h-40 md:h-48 object-contain rounded-lg shadow mx-auto block" />
                  </div>
                </div>
                <div className="absolute right-2 bottom-2 md:-right-4 md:-bottom-4 w-20 h-20 md:w-24 md:h-24 bg-amber-400 rounded-full shadow-lg flex items-center justify-center text-white font-bold">
                  <div className="text-center">
                    <div className="text-xs sm:text-sm">BalİZ</div>
                    <div className="text-xs">Parmak</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Duyurular */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-amber-800 inline-block relative">
              <span className="relative z-10">Son Duyurular</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-300 opacity-50 z-0"></span>
            </h2>
            <p className="text-amber-700 mt-2">Etkinlik ve duyurularımızı takip edin</p>
          </div>

          {/* Duyuru Kartları */}
          <div className="relative">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Hata! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            ) : announcements.length === 0 ? (
              <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full text-amber-400">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-amber-800 text-lg font-medium">Henüz duyuru bulunmamaktadır</p>
                <p className="text-amber-600 mt-2">İlk duyuru eklendiğinde burada görüntülenecektir</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Sadece en son duyuruyu göster */}
                <div 
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-amber-200 relative overflow-hidden max-w-4xl mx-auto"
                >
                  {/* Bal peteği deseni arka planda */}
                  <div className="absolute inset-0 opacity-5 pattern-honeycomb pattern-amber-500 pattern-bg-transparent pattern-size-6"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                      <h3 className="text-2xl font-bold text-amber-800">{announcements[0].title}</h3>
                      <span className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">{announcements[0].date}</span>
                    </div>
                    
                    {/* Duyuru görseli */}
                    {announcements[0].image_url && (
                      <div className="mb-6 relative rounded-lg overflow-hidden">
                        <img 
                          src={announcements[0].image_url} 
                          alt={announcements[0].title}
                          className="w-full h-64 md:h-80 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-image.png";
                            e.target.classList.add("opacity-60");
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="prose prose-amber max-w-none">
                      <p className="text-amber-900">{announcements[0].content}</p>
                    </div>
                    
                    {announcements[0].link && (
                      <div className="mt-6">
                        <a 
                          href={announcements[0].link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-2 rounded-md transition-colors"
                        >
                          Detaylı Bilgi
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Tüm duyurular bağlantısı */}
                <div className="text-center mt-10">
                  <Link 
                    href="/duyurular" 
                    className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md"
                  >
                    Tüm Duyuruları Görüntüle
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Misyonumuz Bölümü */}
        <section className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="bg-white rounded-xl shadow-md p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 -mt-8 -mr-8 bg-amber-300 rounded-full opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-amber-800 mb-4">Faaliyetlerimiz</h2>
              <p className="text-gray-700 mb-4">
                BalİZ Parmak Kulübü olarak, engelli bireylerin yaşamını kolaylaştırmak ve toplumsal farkındalığı artırmak için çeşitli projeler yürütüyoruz.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Erişilebilir gezi ve eğlence etkinlikleri
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  İşaret dili eğitim programları
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Erişilebilirlik çalışmaları
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Sosyal entegrasyon etkinlikleri
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 h-32 w-32 -mb-8 -ml-8 bg-amber-300 rounded-full opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-amber-800 mb-4">Değerlerimiz</h2>
              <p className="text-gray-700 mb-4">
                Gönüllülük esasıyla hareket eden topluluğumuz, öğrencilerin kendilerini gerçekleştirmeleri için gerekli ortamı sağlar.
                Fırsat eşitliği ve kapsayıcılık ilkelerimizden asla taviz vermiyoruz.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Eşitlik ve kapsayıcılık
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Gönüllülük ve dayanışma
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Şeffaflık ve güvenilirlik
                </li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* İstatistikler */}
        <section className="py-10 bg-amber-700 text-white rounded-xl shadow-lg mb-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">Etki Alanımız</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">750+</div>
                <p>Desteklenen Öğrenci</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">45+</div>
                <p>Gönüllü Eğitmen</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">120+</div>
                <p>Eğitim Etkinliği</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">2000+</div>
                <p>Dağıtılan Kaynak</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Etkinliklerimiz */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-amber-800 inline-block relative">
              <span className="relative z-10">Etkinliklerimiz</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-300 opacity-50 z-0"></span>
            </h2>
            <p className="text-amber-700 mt-2">Katılabileceğiniz etkinlikler ve kaynaklar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kitap Oku ve Dinle */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-amber-100">
              <div className="h-48 bg-amber-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-800 mb-2">Kitap Oku ve Dinle</h3>
                <p className="text-amber-700 mb-4">İşaret dili eğitim videoları ve kitap önerilerimizi keşfedin.</p>
                <Link 
                  href="/kitap-oku-dinle" 
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Keşfet
                </Link>
              </div>
            </div>
            
            {/* Diğer etkinlikler için boş şablonlar */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100">
              <div className="h-48 bg-amber-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-800 mb-2">Atölyeler</h3>
                <p className="text-amber-700 mb-4">Yakında gerçekleşecek işaret dili ve iletişim atölyelerimiz.</p>
                <span className="inline-block bg-amber-200 text-amber-700 py-1 px-3 rounded text-sm">Yakında</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100">
              <div className="h-48 bg-amber-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-800 mb-2">Etkinlik Takvimi</h3>
                <p className="text-amber-700 mb-4">Tüm etkinliklerimizi takip edebileceğiniz etkinlik takvimimiz.</p>
                <span className="inline-block bg-amber-200 text-amber-700 py-1 px-3 rounded text-sm">Yakında</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Kitap Önerileri */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-amber-800 inline-block relative">
              <span className="relative z-10">Kitap Önerileri</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-300 opacity-50 z-0"></span>
            </h2>
            <p className="text-amber-700 mt-2">Kulübümüzün ilham veren kitap önerileri</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Kitap */}
            <div className="bg-amber-100 rounded-lg shadow-md overflow-hidden border border-amber-100">
              <div className="h-48 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="bg-amber-50 p-6">
                <h3 className="text-lg font-bold text-amber-800 mb-1">Körlük</h3>
                <p className="text-amber-700 text-sm mb-2">Yazar: Jose Saramago</p>
                <p className="text-amber-700 text-sm">Toplumsal çöküş ve insan doğası üzerine çarpıcı bir roman.</p>
              </div>
            </div>
            {/* 2. Kitap */}
            <div className="bg-amber-100 rounded-lg shadow-md overflow-hidden border border-amber-100">
              <div className="h-48 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="bg-amber-50 p-6">
                <h3 className="text-lg font-bold text-amber-800 mb-1">Empati</h3>
                <p className="text-amber-700 text-sm mb-2">Yazar: Adam Fawer</p>
                <p className="text-amber-700 text-sm">İnsan zihninin sınırlarını ve empati gücünü sorgulatan sürükleyici bir roman.</p>
              </div>
            </div>
            {/* 3. Kitap */}
            <div className="bg-amber-100 rounded-lg shadow-md overflow-hidden border border-amber-100">
              <div className="h-48 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="bg-amber-50 p-6">
                <h3 className="text-lg font-bold text-amber-800 mb-1">Zorba</h3>
                <p className="text-amber-700 text-sm mb-2">Yazar: Nikos Kazancakis</p>
                <p className="text-amber-700 text-sm">Hayatın anlamı, özgürlük ve dostluk üzerine unutulmaz bir başyapıt.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* İstatistikler */}
        <section className="py-12 bg-amber-600 text-white rounded-xl shadow-lg mb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pattern-honeycomb pattern-white pattern-bg-transparent pattern-size-6"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-2xl font-bold text-center mb-12">Rakamlarla BalİZ Parmak</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="relative">
                  <div className="bg-white w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-amber-600">5+</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 rounded-full opacity-50"></div>
                </div>
                <p className="text-lg">Yıllık Tecrübe</p>
              </div>
              <div>
                <div className="relative">
                  <div className="bg-white w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-amber-600">250+</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 rounded-full opacity-50"></div>
                </div>
                <p className="text-lg">Aktif Üye</p>
              </div>
              <div>
                <div className="relative">
                  <div className="bg-white w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-amber-600">30+</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 rounded-full opacity-50"></div>
                </div>
                <p className="text-lg">Yıllık Etkinlik</p>
              </div>
              <div>
                <div className="relative">
                  <div className="bg-white w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-amber-600">15+</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 rounded-full opacity-50"></div>
                </div>
                <p className="text-lg">Kurumsal Partner</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Network Bölümü */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 -mt-8 -mr-8 bg-amber-300 rounded-full opacity-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center">Network</h2>
            <p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
              BalİZ Parmak, üyeleri arasında güçlü bir bağ ve dayanışma ağı oluşturur. Kulüp; sosyal girişimciler, akademisyenler ve sivil toplum kuruluşları ile iş birliği yaparak öğrencilere ilham verici buluşmalar ve yeni fırsatlar sunar.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <div className="w-12 h-12 mb-4 text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-amber-800 mb-2">Öğrenci Toplulukları</h3>
                <p className="text-gray-700">
                  Diğer öğrenci toplulukları ile iş birliği yaparak ortak projeler geliştiriyoruz.
                </p>
              </div>
              
              <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <div className="w-12 h-12 mb-4 text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-amber-800 mb-2">Sivil Toplum Kuruluşları</h3>
                <p className="text-gray-700">
                  STK'lar ile birlikte çalışarak toplumsal fayda odaklı projeler üretiyoruz.
                </p>
              </div>
              
              <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <div className="w-12 h-12 mb-4 text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-amber-800 mb-2">Profesyonel Kurumlar</h3>
                <p className="text-gray-700">
                  Profesyonel kurumlarla bağlantılar kurarak üyelerimize staj ve iş imkanları sağlıyoruz.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-amber-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} BalİZ Parmak Kulübü. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
} 
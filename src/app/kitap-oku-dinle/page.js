'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Ana içerik bileşeni
const KitapOkuDinleContent = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const selectedVideoId = searchParams.get('video');

  // Videoları API'den çekme
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/videos');
        
        if (!response.ok) {
          throw new Error('Videolar alınamadı');
        }
        
        const data = await response.json();
        if (data && data.videos) {
          // Türkçe tarih formatını JavaScript'in anlayabileceği formata çevirme fonksiyonu
          function parseTurkishDate(dateStr) {
            if (!dateStr) return new Date(0); // Geçersiz tarih varsa en eski tarihi döndür
            
            // ISO format kontrolü (yyyy-mm-dd)
            if (dateStr.includes('-')) {
              return new Date(dateStr);
            }
            
            // Türkçe format (dd.mm.yyyy)
            if (dateStr.includes('.')) {
              const parts = dateStr.split('.');
              if (parts.length === 3) {
                // Ay değeri 0-11 arasında olmalı, bu yüzden 1 çıkarıyoruz
                return new Date(parts[2], parts[1] - 1, parts[0]);
              }
            }
            
            // Son çare olarak doğrudan Date'i dene
            return new Date(dateStr);
          }
          
          // Önce ID'ye göre sırala (daha yüksek ID daha yeni demektir)
          const sortedByIdVideos = [...data.videos].sort((a, b) => {
            // Sayısal olarak karşılaştır (string olarak değil)
            return Number(b.id) - Number(a.id);
          });
          
          // Sonra tarihe göre sırala (en yeni en üstte olacak şekilde)
          const sortedVideos = sortedByIdVideos.sort((a, b) => {
            const dateA = parseTurkishDate(a.date);
            const dateB = parseTurkishDate(b.date);
            
            // Önce tarihleri karşılaştır
            const dateDiff = dateB - dateA;
            
            // Eğer tarihler aynıysa, ID'ye göre sırala
            if (dateDiff === 0) {
              return Number(b.id) - Number(a.id);
            }
            
            return dateDiff;
          });
          
          console.log("Sıralanmış videolar:", sortedVideos.map(v => ({id: v.id, title: v.title, date: v.date})));
          
          setVideos(sortedVideos);
        }
      } catch (error) {
        console.error('Video yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const kitaplar = [
    {
      id: 1,
      baslik: "Körlük",
      yazar: "Jose Saramago",
      aciklama: "Toplumsal çöküş ve insan doğası üzerine çarpıcı bir roman.",
      gorsel: "/placeholder-image.png"
    },
    {
      id: 2,
      baslik: "Empati",
      yazar: "Adam Fawer",
      aciklama: "İnsan zihninin sınırlarını ve empati gücünü sorgulatan sürükleyici bir roman.",
      gorsel: "/placeholder-image.png"
    },
    {
      id: 3,
      baslik: "Zorba",
      yazar: "Nikos Kazancakis",
      aciklama: "Hayatın anlamı, özgürlük ve dostluk üzerine unutulmaz bir başyapıt.",
      gorsel: "/placeholder-image.png"
    }
  ];

  // Videoların olup olmadığını kontrol et
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
      </div>
    );
  }

  // Seçili video bul
  const selectedVideo = selectedVideoId && videos.length > 0
    ? videos.find(v => v.id.toString() === selectedVideoId)
    : null;
  // Diğer videolar (seçili video hariç)
  const otherVideos = selectedVideo
    ? videos.filter(v => v.id.toString() !== selectedVideoId)
    : videos;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 -mt-10 -mr-10 bg-amber-300 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 -mb-8 -ml-8 bg-amber-300 rounded-full opacity-20"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-amber-800 mb-6 inline-block relative">
              <span className="relative z-10">Kitap Oku ve Dinle</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-300 opacity-50 z-0"></span>
            </h1>
            
            {/* Seçili video büyük şekilde */}
            {selectedVideo && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-amber-700 mb-4">Seçili Video</h2>
                <div className="bg-amber-50 rounded-lg overflow-hidden shadow-md border border-amber-400 mb-6">
                  <div className="relative pb-[56.25%] bg-amber-100">
                    {selectedVideo.youtubeId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                        title={selectedVideo.title}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-amber-800">{selectedVideo.title}</h3>
                    {selectedVideo.description && (
                      <p className="text-amber-700 mt-2">{selectedVideo.description}</p>
                    )}
                    <div className="mt-3 text-xs text-amber-600">{selectedVideo.date}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Eğitim Videoları - Diğerleri küçük kartlar */}
            {otherVideos.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-amber-700 mb-6">Eğitim Videoları</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherVideos.map((video) => (
                    <div key={video.id} className="bg-amber-50 rounded-lg overflow-hidden shadow-md border border-amber-200 transition-all hover:shadow-lg hover:-translate-y-1">
                      <div className="relative pb-[56.25%] bg-amber-100">
                        {video.youtubeId ? (
                          <iframe 
                            src={`https://www.youtube.com/embed/${video.youtubeId}`}
                            title={video.title}
                            className="absolute inset-0 w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-amber-800">{video.title}</h3>
                        {video.description && (
                          <p className="text-amber-700 mt-2">{video.description}</p>
                        )}
                        <div className="mt-3 text-xs text-amber-600">{video.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-amber-700 mb-8">
              BalİZ Parmak Kulübü olarak okuma ve dinleme etkinliklerimiz ile bilgi ve ilham kaynağı olmayı hedefliyoruz.
              Aşağıda kulüp üyelerimiz için hazırladığımız kitap önerilerini bulabilirsiniz.
            </p>
            {/* PDF Açıklama Kutusu */}
            <div className="mb-4 p-4 bg-amber-100 rounded text-amber-900 font-semibold animate-fade-in-up shadow-md">
              Türkiye'de ilk ve tek: Hem görme engelliler için Braille alfabesiyle, hem de normal Latin harfleriyle basılan ve ayrıca sesli destek sunan bir dergi çıkardık. Bu özellikleriyle Türkiye'de bir ilk olma özelliği taşıyor.
            </div>
            {/* PDF İndirme Linki */}
            <div className="mb-8 animate-fade-in-up">
              <a
                href="https://linktr.ee/balizparmak.01"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded transition-colors shadow-md animate-bounce-glow"
              >
                Baliz Macera PDF'yi indir
              </a>
            </div>
            
            {/* Kitap Önerileri */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-6">Kitap Önerileri</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {kitaplar.map((kitap) => (
                  <div key={kitap.id} className="bg-amber-50 rounded-lg overflow-hidden shadow-md border border-amber-200 transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className="h-48 bg-amber-200 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-amber-800">{kitap.baslik}</h3>
                      <p className="text-amber-600 mb-2">Yazar: {kitap.yazar}</p>
                      <p className="text-amber-700">{kitap.aciklama}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Ana sayfa bileşeni
export default function KitapOkuDinlePage() {
  return (
      <Suspense fallback={<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>}>
        <KitapOkuDinleContent />
      </Suspense>
  );
} 
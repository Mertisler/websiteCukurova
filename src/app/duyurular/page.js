'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcements');
        if (!response.ok) {
          throw new Error('Duyurular alınamadı');
        }
        const data = await response.json();
        if (data && data.announcements) {
          setAnnouncements(data.announcements);
          setLoading(false);
        } else {
          // API doğru yanıt döndüremiyor, localStorage kontrolü yap
          try {
            const localAnnouncements = JSON.parse(localStorage.getItem('announcements') || '[]');
            if (localAnnouncements && localAnnouncements.length > 0) {
              setAnnouncements(localAnnouncements);
            } else {
              setAnnouncements([]);
            }
          } catch {
            console.error('LocalStorage hatası');
            setAnnouncements([]);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Duyurular yüklenirken hata oluştu:', error);
        
        // API hatası durumunda localStorage'a düş
        try {
          const localAnnouncements = JSON.parse(localStorage.getItem('announcements') || '[]');
          if (localAnnouncements && localAnnouncements.length > 0) {
            setAnnouncements(localAnnouncements);
            setError(null); // localStorage'dan veriler geldiği için hatayı kaldır
          } else {
            setError('Duyurular yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
          }
        } catch (localError) {
          setError('Duyurular yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
        }
        
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Başlık bölümü */}
        <div className="text-center mb-12 relative">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-amber-200 rounded-full opacity-50 blur-xl"></div>
          <h1 className="text-4xl font-bold text-amber-800 inline-block relative">
            <span className="relative z-10">Duyurular</span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-300 opacity-50 z-0"></span>
          </h1>
          <p className="text-lg text-amber-700 mt-3 max-w-2xl mx-auto">
            Kulübümüzün en güncel duyurularını takip edin ve etkinliklerimizden haberdar olun
          </p>
        </div>

        {/* Duyurular içeriği */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-amber-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-red-700">
              <h2 className="text-xl font-semibold mb-4">Hata</h2>
              <p>{error}</p>
            </div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-amber-50 p-8 rounded-lg border-2 border-dashed border-amber-200 text-amber-700 text-center">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-4">Duyuru Bulunamadı</h2>
              <p>Şu anda aktif bir duyuru bulunmamaktadır.</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Bal peteği arkaplan deseni */}
            <div className="relative">
              <div className="absolute inset-0 opacity-5 pattern-honeycomb pattern-amber-500 pattern-bg-transparent pattern-size-8 pointer-events-none"></div>
              
              {/* Duyuru listesi */}
              <div className="space-y-10 relative z-10">
                {announcements.map((announcement) => (
                  <div 
                    key={announcement.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-amber-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                  >
                    <div className="md:flex">
                      {/* Duyuru görseli */}
                      {announcement.image_url && (
                        <div className="md:w-2/5 overflow-hidden">
                          <div className="h-48 overflow-hidden rounded-t-lg">
                            <Image 
                              src={announcement.image_url} 
                              alt={announcement.title}
                              width={400}
                              height={200}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder-image.png";
                                e.target.classList.add("opacity-50");
                              }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Duyuru içeriği */}
                      <div className={`p-6 md:p-8 ${announcement.image_url ? 'md:w-3/5' : 'w-full'}`}>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
                          <h2 className="text-2xl font-bold text-amber-800">{announcement.title}</h2>
                          <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                            {announcement.date}
                          </span>
                        </div>
                        
                        <div className="prose prose-amber mb-6">
                          <p className="text-amber-900 line-clamp-3 md:line-clamp-4">{announcement.content}</p>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Link 
                            href={`/duyurular/${announcement.id}`} 
                            className="inline-flex items-center text-amber-600 hover:text-amber-800 font-medium group"
                          >
                            Devamını oku
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </Link>
                          
                          {/* Bal damlası ikonu */}
                          <div className="text-amber-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.0001 3.25C12.0001 3.25 18.5 10 18.5 14.5C18.5 18.2942 15.5844 21.25 12.0001 21.25C8.41568 21.25 5.50008 18.2942 5.50008 14.5C5.50008 10 12.0001 3.25 12.0001 3.25Z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
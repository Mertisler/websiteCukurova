'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

export default function AnnouncementDetail({ params }) {
  // Params'ı React.use ile çöz
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncementDetail = async () => {
      try {
        // Doğru API endpoint'ini kullan
        const response = await fetch(`/api/announcements?id=${id}`);
        if (!response.ok) {
          throw new Error('Duyuru detayları alınamadı');
        }
        const data = await response.json();
        if (data && data.announcement) {
          setAnnouncement(data.announcement);
        } else {
          // Announcement bulunamazsa, localStorage'da arayalım
          try {
            const localAnnouncements = JSON.parse(localStorage.getItem('announcements') || '[]');
            const localAnnouncement = localAnnouncements.find(a => a.id.toString() === id.toString());
            if (localAnnouncement) {
              setAnnouncement(localAnnouncement);
            } else {
              setError('Duyuru bulunamadı');
            }
          } catch (localError) {
            console.error('LocalStorage hatası:', localError);
            setError('Duyuru bulunamadı');
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Duyuru detayları yüklenirken hata oluştu:', error);
        
        // API hatası durumunda localStorage'ı kontrol et
        try {
          const localAnnouncements = JSON.parse(localStorage.getItem('announcements') || '[]');
          const localAnnouncement = localAnnouncements.find(a => a.id.toString() === id.toString());
          if (localAnnouncement) {
            setAnnouncement(localAnnouncement);
          } else {
            setError('Duyuru detayları yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
          }
        } catch (localError) {
          setError('Duyuru detayları yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
        }
        
        setLoading(false);
      }
    };

    fetchAnnouncementDetail();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
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
              <div className="mt-6">
                <Link href="/duyurular" className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Tüm Duyurular
                </Link>
              </div>
            </div>
          </div>
        ) : !announcement ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-amber-50 p-8 rounded-lg border-2 border-dashed border-amber-200 text-amber-700 text-center">
              <div className="w-20 h-20 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-4">Duyuru Bulunamadı</h2>
              <p>İstediğiniz duyuru bulunamadı veya kaldırılmış olabilir.</p>
              <div className="mt-6">
                <Link href="/duyurular" className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Tüm Duyurular
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Ana içerik */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-amber-200 relative overflow-hidden">
              {/* Bal peteği deseni arka planda */}
              <div className="absolute inset-0 opacity-5 pattern-honeycomb pattern-amber-500 pattern-bg-transparent pattern-size-6"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <h1 className="text-3xl font-bold text-amber-800">{announcement.title}</h1>
                  <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                    {announcement.date}
                  </span>
                </div>
                
                {/* Duyuru görseli */}
                {announcement.image_url && (
                  <div className="mb-8 rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={announcement.image_url} 
                      alt={announcement.title}
                      className="w-full max-h-96 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-image.png";
                        e.target.classList.add("opacity-50");
                      }}
                    />
                  </div>
                )}
                
                {/* İçerik */}
                <div className="prose prose-amber max-w-none">
                  <p className="text-lg text-amber-900 whitespace-pre-line">{announcement.content}</p>
                </div>
                
                {/* Link varsa */}
                {announcement.link && (
                  <div className="mt-6">
                    <a 
                      href={announcement.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-md transition-colors"
                    >
                      Detaylı Bilgi
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
                
                <div className="mt-10 pt-6 border-t border-amber-200 flex justify-between items-center">
                  <Link 
                    href="/duyurular" 
                    className="inline-flex items-center text-amber-600 hover:text-amber-800 font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Tüm Duyurular
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
        )}
      </div>
    </div>
  );
} 
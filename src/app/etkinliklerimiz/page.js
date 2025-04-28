'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function Etkinliklerimiz() {
  const [loading, setLoading] = useState(true);
  
  // Örnek etkinlik verileri
  const etkinlikler = [
    {
      id: 1,
      baslik: "İşaret Dili Atölyesi",
      tarih: "15 Mayıs 2025",
      saat: "14:00 - 17:00",
      yer: "Çukurova Üniversitesi Merkez Amfi",
      aciklama: "Temel işaret dili eğitimi verilecek olan bu atölyemizde, günlük hayatta kullanılan işaret dilini öğrenerek iletişim becerilerinizi geliştirebilirsiniz.",
      resim: "/images/isaret-dili.jpg",
      kontenjan: 30,
      kalan: 12
    },
    {
      id: 2,
      baslik: "Engelsiz Yaşam Paneli",
      tarih: "22 Mayıs 2025",
      saat: "10:00 - 12:30",
      yer: "Çukurova Üniversitesi Konferans Salonu",
      aciklama: "Engelli bireylerin günlük yaşamda karşılaştıkları zorluklar ve çözüm önerileri hakkında uzmanların konuşmacı olarak katılacağı panel düzenlenecektir.",
      resim: "/images/panel.jpg",
      kontenjan: 150,
      kalan: 75
    },
    {
      id: 3,
      baslik: "Farkındalık Yürüyüşü",
      tarih: "3 Haziran 2025",
      saat: "09:00",
      yer: "Çukurova Üniversitesi Ana Giriş",
      aciklama: "Engelli bireylerin toplumsal yaşamda karşılaştıkları engellere dikkat çekmek amacıyla kampüs içinde farkındalık yürüyüşü gerçekleştirilecektir.",
      resim: "/images/yuruyus.jpg",
      kontenjan: 250,
      kalan: 180
    },
    {
      id: 4,
      baslik: "Bal Kültürü ve Arıcılık Semineri",
      tarih: "10 Haziran 2025",
      saat: "14:30 - 16:00",
      yer: "Ziraat Fakültesi Konferans Salonu",
      aciklama: "Bal üretimi, arıcılık ve ekosistemdeki önemi hakkında bilgi vereceğimiz seminerimize tüm öğrencilerimiz davetlidir.",
      resim: "/images/aricilik.jpg",
      kontenjan: 100,
      kalan: 65
    }
  ];

  // Sayfa yüklendiğinde loading durumunu kapat
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Başlık */}
        <div className="text-center mb-16 relative">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-amber-200 rounded-full opacity-50 blur-xl"></div>
          <h1 className="text-4xl font-bold text-amber-800 inline-block relative">
            <span className="relative z-10">Etkinliklerimiz</span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-300 opacity-50 z-0"></span>
          </h1>
          <p className="text-lg text-amber-700 mt-3 max-w-2xl mx-auto">
            BalİZ Parmak Kulübü olarak düzenlediğimiz etkinliklere katılarak, engelsiz bir dünya için bizimle birlikte adım atabilirsiniz.
          </p>
        </div>
        
        {/* Etkinlikler Listesi */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-amber-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin"></div>
            </div>
          </div>
        ) : etkinlikler.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-amber-50 p-8 rounded-lg border-2 border-dashed border-amber-200 text-amber-700 text-center">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-4">Etkinlik Bulunamadı</h2>
              <p>Şu anda planlanmış bir etkinlik bulunmamaktadır. Yakında yeni etkinliklerimiz olacaktır.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {etkinlikler.map((etkinlik) => (
              <div 
                key={etkinlik.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-amber-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              >
                {/* Etkinlik görseli */}
                <div className="h-52 bg-amber-100 relative">
                  <div className="absolute inset-0 bg-amber-200 opacity-50 pattern-honeycomb pattern-amber-500 pattern-bg-transparent pattern-size-4"></div>
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Tarih bilgisi */}
                  <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {etkinlik.tarih}
                  </div>
                </div>
                
                {/* Etkinlik içeriği */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-amber-800 mb-3">{etkinlik.baslik}</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-amber-700">
                      <svg className="h-5 w-5 mr-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{etkinlik.saat}</span>
                    </div>
                    
                    <div className="flex items-center text-amber-700">
                      <svg className="h-5 w-5 mr-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{etkinlik.yer}</span>
                    </div>
                    
                    <div className="flex items-center text-amber-700">
                      <svg className="h-5 w-5 mr-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <span>Kontenjan: {etkinlik.kontenjan} | Kalan: {etkinlik.kalan}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{etkinlik.aciklama}</p>
                  
                  <div className="flex justify-between items-center">
                    <button className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Katıl
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                    
                    {/* Bal damlası ikonu */}
                    <div className="text-amber-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.0001 3.25C12.0001 3.25 18.5 10 18.5 14.5C18.5 18.2942 15.5844 21.25 12.0001 21.25C8.41568 21.25 5.50008 18.2942 5.50008 14.5C5.50008 10 12.0001 3.25 12.0001 3.25Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Alt bölüm */}
        <div className="mt-16 bg-amber-600 rounded-xl p-6 text-white max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h3 className="text-xl font-bold mb-2">Yeni Etkinliklerden Haberdar Olun</h3>
              <p>Etkinliklerimizden haberdar olmak için kulüp üyesi olabilirsiniz.</p>
            </div>
            <Link 
              href="/uye-ol" 
              className="inline-flex items-center bg-white text-amber-700 hover:bg-amber-100 py-2 px-6 rounded-lg font-medium transition-colors shadow-md"
            >
              Hemen Üye Ol
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
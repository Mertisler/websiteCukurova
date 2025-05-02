'use client';

import { useState, useEffect, useRef , Suspense } from 'react';
import QRCode from 'qrcode';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Ana içerik bileşeni
const QrKodContent = () => {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [videolar, setVideolar] = useState([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);
  const searchParams = useSearchParams();
  const videoId = searchParams.get('video') || '1';
  const [secilenVideo, setSecilenVideo] = useState(null);

  // Videoları ve seçili videoyu yükle
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Yerel depolamadan videoları getir
        const storedVideos = localStorage.getItem("videos");
        
        let videoList = [];
        if (storedVideos) {
          videoList = JSON.parse(storedVideos);
          setVideolar(videoList);
        } else {
          // Yerel videolar yoksa örnek videolar kullan
          videoList = [
            {
              id: 1,
              title: "İşaret Dili Eğitimi - Temel İletişim",
              description: "Bu eğitim videosunda, işaret dilinde temel iletişim kurma becerilerini öğreneceksiniz.",
              youtubeId: "8645Yjp1tGA",
              date: new Date().toLocaleDateString('tr-TR')
            },
            {
              id: 2,
              title: "İşaret Dili - Pratik Gösterim",
              description: "Bu kısa videoda işaret dilinde pratik bir uygulama gösterilmektedir.",
              youtubeId: "xtt9rMk-Ov0",
              date: new Date().toLocaleDateString('tr-TR')
            }
          ];
          
          setVideolar(videoList);
          localStorage.setItem("videos", JSON.stringify(videoList));
        }
        
        // Video ID'ye göre seçili videoyu bul
        const selectedVideo = videoList.find(video => video.id.toString() === videoId);
        setSecilenVideo(selectedVideo || videoList[0]);
      } catch (err) {
        console.error("Videolar yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [videoId]);

  // Seçili video için QR kod oluştur
  useEffect(() => {
    if (secilenVideo) {
      const generateQR = async () => {
        try {
          // QR kodun hedef URL'si
          const baseUrl = process.env.NODE_ENV === "production"
            ? "https://www.balizparmak.com" // BURAYI kendi canlı domain adresinle değiştir
            : "http://localhost:3001";
          const videoUrl = `${baseUrl}/kitap-oku-dinle?video=${secilenVideo.id}`;
          
          // Canvas QR kodu
          if (canvasRef.current) {
            await QRCode.toCanvas(canvasRef.current, videoUrl, {
              width: 300,
              margin: 2,
              color: {
                dark: '#D97706', // Amber-600
                light: '#FFFFFF',
              },
            });
          }
          
          // İndirilebilir QR kodu için veri URL'i
          const dataUrl = await QRCode.toDataURL(videoUrl, {
            width: 800,
            margin: 2,
            color: {
              dark: '#D97706', // Amber-600
              light: '#FFFFFF',
            },
          });
          setQrDataUrl(dataUrl);
        } catch (err) {
          console.error('QR kodu oluşturulurken hata:', err);
        }
      };

      generateQR();
    }
  }, [secilenVideo]);

  // QR kodunu indirme fonksiyonu
  const downloadQrCode = () => {
    if (qrDataUrl && secilenVideo) {
      const link = document.createElement('a');
      link.href = qrDataUrl;
      const fileName = `bariz-parmak-${secilenVideo.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
      </div>
    );
  }

  // Videoların olmadığı durumu
  if (!secilenVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10">
            <h1 className="text-3xl font-bold text-amber-800 mb-6">QR Kod Oluşturucu</h1>
            <div className="bg-amber-50 p-8 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <h2 className="text-xl font-bold text-amber-800 mb-2">Video Bulunamadı</h2>
              <p className="text-amber-700 mb-4">İstediğiniz video bulunamadı veya henüz hiçbir video eklenmemiş.</p>
              <Link 
                href="/kitap-oku-dinle" 
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Video Sayfasına Dön
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 -mt-10 -mr-10 bg-amber-300 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 -mb-8 -ml-8 bg-amber-300 rounded-full opacity-20"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-amber-800 mb-6 inline-block relative">
              <span className="relative z-10">QR Kod: {secilenVideo.title}</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-300 opacity-50 z-0"></span>
            </h1>
            
            <p className="text-amber-700 mb-8">
              Aşağıdaki QR kodu, <strong>{secilenVideo.title}</strong> videomuz için oluşturulmuştur. 
              Bu kodu kitap kapaklarına, broşürlere veya tanıtım materyallerine ekleyerek, 
              kullanıcıların mobil cihazlarıyla hızlıca videomuza erişmesini sağlayabilirsiniz.
            </p>
            
            {/* Video Seçim Bölümü */}
            <div className="bg-amber-50 p-4 rounded-lg mb-8">
              <h2 className="text-xl font-bold text-amber-800 mb-3">Diğer Videolar İçin QR Kod</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {videolar.map((video) => (
                  <Link 
                    key={video.id} 
                    href={`/qr-kod?video=${video.id}`}
                    className={`p-3 rounded-lg transition-colors ${
                      video.id.toString() === videoId 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-white hover:bg-amber-100 text-amber-800'
                    }`}
                  >
                    {video.title}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-md border border-amber-200">
                <canvas ref={canvasRef} className="mx-auto"></canvas>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h2 className="text-xl font-bold text-amber-800 mb-2">Nasıl Kullanılır?</h2>
                  <ol className="list-decimal pl-5 text-amber-700 space-y-2">
                    <li>QR kodu indirin</li>
                    <li>Kitap kapağı, broşür veya afişlerinize ekleyin</li>
                    <li>Kullanıcılar mobil cihazlarıyla QR kodu taratınca video sayfamıza yönlendirilecek</li>
                  </ol>
                </div>
                
                <button 
                  onClick={downloadQrCode} 
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md w-full"
                >
                  QR Kodu İndir
                </button>
                
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-blue-700">
                  <p className="text-sm">
                    <span className="font-bold">Video:</span> {secilenVideo.title}
                  </p>
                  <p className="text-xs mt-1">
                    <span className="font-bold">URL:</span> http://localhost:3001/kitap-oku-dinle?video={secilenVideo.id}
                  </p>
                  <p className="text-xs mt-1 text-blue-500">
                    Not: Canlı sitede, gerçek site adresinizi kullanmalısınız
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-100 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-amber-800 mb-3">Dikkat Edilecek Noktalar</h2>
              <ul className="list-disc pl-5 text-amber-700 space-y-1">
                <li>Basılı materyallerde QR kodun en az 2x2 cm boyutunda olmasına dikkat edin</li>
                <li>QR kodun etrafında en az 0.5 cm boşluk bırakın</li>
                <li>Yüksek kontrastlı bir zemin üzerine yerleştirin</li>
                <li>Test etmeden kullanmayın, cep telefonunuzla okutarak çalıştığından emin olun</li>
                <li>Canlı sitenizde QR kodun URL&apos;ini gerçek domain adınızla güncellemeyi unutmayın</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Ana sayfa bileşeni
export default function QrKodPage() {
  return (
    <Suspense fallback={<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>}>
      <QrKodContent />
    </Suspense>
  );
} 
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 -mt-10 -mr-10 bg-amber-300 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 -mb-8 -ml-8 bg-amber-300 rounded-full opacity-20"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-amber-800 mb-6 inline-block relative">
              <span className="relative z-10">Hakkımızda</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-300 opacity-50 z-0"></span>
            </h1>
            
            <div className="grid md:grid-cols-2 gap-10 mt-8">
              <div>
                <h2 className="text-xl font-bold text-amber-700 mb-4">Biz Kimiz?</h2>
                <p className="text-amber-700 mb-4">
                  Bal Küpü Duyuru Sistemi, 2023 yılında kurulmuş olup, kurumların ve toplulukların duyurularını kolayca paylaşabilmesi 
                  için tasarlanmış bir platformdur. Tıpkı bal arılarının özverili çalışması gibi, biz de kullanıcılarımıza en tatlı 
                  deneyimi sunmak için çalışıyoruz.
                </p>
                <p className="text-amber-700 mb-4">
                  Misyonumuz, bilginin bal gibi akıcı ve besleyici bir şekilde paylaşılmasını sağlamaktır. Vizyonumuz ise, 
                  duyuru sistemleri arasında en kullanıcı dostu ve etkili platform olmaktır.
                </p>
                <p className="text-amber-700">
                  Kullanıcılarımızın memnuniyeti, bizim için en önemli değerdir. Bu nedenle sürekli olarak sistemimizi geliştiriyor 
                  ve yenilikleri takip ediyoruz.
                </p>
              </div>
              
              <div className="relative h-64 md:h-auto rounded-xl overflow-hidden shadow-md">
                <div className="w-full h-full flex items-center justify-center bg-amber-50">
                  <img src="/baliz.jpg" alt="Baliz Parmak Kulübü Logosu" className="h-32 w-32 md:h-48 md:w-48 object-contain rounded-lg shadow mx-auto" />
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h2 className="text-xl font-bold text-amber-700 mb-4">Değerlerimiz</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-amber-50 p-5 rounded-lg border-2 border-amber-200">
                  <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-amber-800 mb-2">Güvenilirlik</h3>
                  <p className="text-amber-700">
                    Kullanıcıların bilgilerini güvenle saklar, doğru ve zamanında duyurular yapılmasını sağlarız.
                  </p>
                </div>
                
                <div className="bg-amber-50 p-5 rounded-lg border-2 border-amber-200">
                  <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-amber-800 mb-2">Hız</h3>
                  <p className="text-amber-700">
                    Duyurularınızı hızlıca oluşturabilir ve anında paylaşabilirsiniz. Sistemimiz her zaman hızlı ve kesintisiz çalışır.
                  </p>
                </div>
                
                <div className="bg-amber-50 p-5 rounded-lg border-2 border-amber-200">
                  <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-amber-800 mb-2">Kullanım Kolaylığı</h3>
                  <p className="text-amber-700">
                    Herkesin rahatlıkla kullanabileceği sade ve anlaşılır bir arayüz tasarladık. Teknik bilgi gerektirmez.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 
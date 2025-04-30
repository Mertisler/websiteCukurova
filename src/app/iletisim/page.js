'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form doğrulama
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        submitted: true,
        success: false,
        message: 'Lütfen tüm zorunlu alanları doldurun.'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // API endpoint'ine e-posta göndermek için istek yap
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          to: 'islermert88@gmail.com' // E-postanın gönderileceği adres
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'E-posta gönderilirken bir hata oluştu.');
      }
      
      // Başarılı durum
      setStatus({
        submitted: true,
        success: true,
        message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'
      });
      
      // Formu sıfırla
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('İletişim formu hatası:', error);
      
      // Hata durumu
      setStatus({
        submitted: true,
        success: false,
        message: error.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 -mt-10 -mr-10 bg-amber-300 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 -mb-8 -ml-8 bg-amber-300 rounded-full opacity-20"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-amber-800 mb-6 inline-block relative">
              <span className="relative z-10">İletişim</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-300 opacity-50 z-0"></span>
            </h1>
            
            <div className="grid md:grid-cols-2 gap-10 mt-8">
              <div>
                <h2 className="text-xl font-bold text-amber-700 mb-4">Bize Ulaşın</h2>
                <p className="text-amber-700 mb-6">
                  Sorularınız, önerileriniz veya geri bildirimleriniz için aşağıdaki formu doldurabilir veya
                  doğrudan iletişim bilgilerimizi kullanarak bize ulaşabilirsiniz.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-amber-100 p-3 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-amber-800">Adres</h3>
                      <p className="text-amber-700">Çukurova Üniversitesi Rektörlüğü, Balcalı, 01330 Sarıçam/Adana</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-amber-100 p-3 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-amber-800">E-posta</h3>
                      <a href="mailto:islermert88@gmail.com" className="text-amber-700 hover:text-amber-500 transition-colors">
                        islermert88@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-amber-100 p-3 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-amber-800">Telefon</h3>
                      <a href="tel:+905469787522" className="text-amber-700 hover:text-amber-500 transition-colors">
                        +90 546 978 7522
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-amber-700 mb-4">Mesaj Bırakın</h2>
                
                {status.submitted && (
                  <div className={`mb-6 p-4 rounded-lg ${status.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    <p>{status.message}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-amber-800 font-medium mb-1">
                      İsim Soyisim <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-colors"
                      placeholder="İsim Soyisim"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-amber-800 font-medium mb-1">
                      E-posta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-colors"
                      placeholder="E-posta Adresiniz"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-amber-800 font-medium mb-1">
                      Konu
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-colors"
                      placeholder="Mesajınızın Konusu"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-amber-800 font-medium mb-1">
                      Mesaj <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-colors"
                      placeholder="Mesajınızı buraya yazın..."
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${isSubmitting ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'} text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Gönderiliyor...
                      </>
                    ) : (
                      'Mesajı Gönder'
                    )}
                  </button>
                </form>
              </div>
            </div>
            
            <div className="mt-12">
              <h2 className="text-xl font-bold text-amber-700 mb-4">Konumumuz</h2>
              <div className="h-96 bg-amber-50 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.9049374037584!2d35.35284801558244!3d36.99838856933242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15288f999332fcc3%3A0x71f5203c231ff916!2s%C3%87ukurova%20%C3%9Cniversitesi!5e0!3m2!1str!2str!4v1651234567890!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 
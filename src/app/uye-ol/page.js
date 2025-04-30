'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function UyeOl() {
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    telefon: '',
    ogrenciNo: '',
    fakulte: '',
    bolum: '',
    sinif: '',
    kulupTercih: 'baski-parmak',
    mesaj: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // API endpoint'ine başvuru gönderme
      const response = await fetch('/api/uyelik-basvuru', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Başvuru gönderilirken bir hata oluştu.');
      }
      
      // Başarılı durumda
      setSubmitted(true);
    } catch (err) {
      console.error('Form gönderme hatası:', err);
      setError(err.message || 'Form gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 border-2 border-amber-200 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pattern-honeycomb pattern-amber-500 pattern-bg-transparent pattern-size-6"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">Üyelik Talebiniz Alındı!</h2>
              <p className="text-gray-700 mb-6">
                Başvurunuz için teşekkür ederiz. Formunuz başarıyla iletildi. Kulüp yönetimimiz başvurunuzu en kısa sürede değerlendirecek ve sizinle iletişime geçecektir.
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-amber-800 inline-block relative">
              <span className="relative z-10">Üye Ol</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-300 opacity-50 z-0"></span>
            </h1>
            <p className="text-amber-700 mt-2 max-w-xl mx-auto">
              BalİZ Parmak Kulübü&apos;ne üye olmak için aşağıdaki formu doldurabilirsiniz. Başvurunuz kulüp yönetimi tarafından değerlendirilecektir.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pattern-honeycomb pattern-amber-500 pattern-bg-transparent pattern-size-6"></div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 relative" role="alert">
                <strong className="font-bold">Hata! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ad" className="block text-amber-800 font-medium mb-1">Adınız*</label>
                  <input
                    type="text"
                    id="ad"
                    name="ad"
                    value={formData.ad}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="soyad" className="block text-amber-800 font-medium mb-1">Soyadınız*</label>
                  <input
                    type="text"
                    id="soyad"
                    name="soyad"
                    value={formData.soyad}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-amber-800 font-medium mb-1">E-posta*</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="telefon" className="block text-amber-800 font-medium mb-1">Telefon</label>
                  <input
                    type="tel"
                    id="telefon"
                    name="telefon"
                    value={formData.telefon}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="ogrenciNo" className="block text-amber-800 font-medium mb-1">Öğrenci Numarası*</label>
                <input
                  type="text"
                  id="ogrenciNo"
                  name="ogrenciNo"
                  value={formData.ogrenciNo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fakulte" className="block text-amber-800 font-medium mb-1">Fakülte*</label>
                  <select
                    id="fakulte"
                    name="fakulte"
                    value={formData.fakulte}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Seçiniz</option>
                    <option value="Eğitim Fakültesi">Eğitim Fakültesi</option>
                    <option value="Fen-Edebiyat Fakültesi">Fen-Edebiyat Fakültesi</option>
                    <option value="İktisadi ve İdari Bilimler Fakültesi">İktisadi ve İdari Bilimler Fakültesi</option>
                    <option value="Mühendislik Fakültesi">Mühendislik Fakültesi</option>
                    <option value="Tıp Fakültesi">Tıp Fakültesi</option>
                    <option value="Ziraat Fakültesi">Ziraat Fakültesi</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="bolum" className="block text-amber-800 font-medium mb-1">Bölüm*</label>
                  <input
                    type="text"
                    id="bolum"
                    name="bolum"
                    value={formData.bolum}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sinif" className="block text-amber-800 font-medium mb-1">Sınıf*</label>
                  <select
                    id="sinif"
                    name="sinif"
                    value={formData.sinif}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Seçiniz</option>
                    <option value="1">1. Sınıf</option>
                    <option value="2">2. Sınıf</option>
                    <option value="3">3. Sınıf</option>
                    <option value="4">4. Sınıf</option>
                    <option value="5+">5+ Sınıf</option>
                    <option value="Yüksek Lisans">Yüksek Lisans</option>
                    <option value="Doktora">Doktora</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="kulupTercih" className="block text-amber-800 font-medium mb-1">Kulüp*</label>
                  <select
                    id="kulupTercih"
                    name="kulupTercih"
                    value={formData.kulupTercih}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="baski-parmak">BALİZ PARMAK KULÜBÜ</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="mesaj" className="block text-amber-800 font-medium mb-1">Neden katılmak istiyorsunuz?</label>
                <textarea
                  id="mesaj"
                  name="mesaj"
                  value={formData.mesaj}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Kulübe katılma nedeninizi ve beklentilerinizi yazabilirsiniz..."
                ></textarea>
              </div>
              
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`${loading ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'} w-full md:w-auto text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gönderiliyor...
                    </>
                  ) : (
                    'Başvuruyu Gönder'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-amber-600 rounded-xl p-6 text-white text-center">
            <p className="text-lg">
              Herhangi bir sorunuz mu var? <Link href="/iletisim" className="font-bold underline">İletişim sayfamızdan</Link> bize ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 
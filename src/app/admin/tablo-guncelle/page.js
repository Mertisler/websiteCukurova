'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TableUpdatePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState({ message: "", isSuccess: false, isError: false });
  const [loading, setLoading] = useState(false);
  const [tableInfo, setTableInfo] = useState(null);

  useEffect(() => {
    // Sayfa yüklendiğinde oturum durumunu kontrol et
    try {
      const adminAuth = localStorage.getItem("adminAuth");
      if (adminAuth) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('localStorage erişim hatası:', error);
    }
  }, []);

  const handleUpdateTable = async () => {
    try {
      setLoading(true);
      setStatus({ message: "Tablo güncelleniyor...", isSuccess: false, isError: false });
      
      // Tablo güncelleme API'sini çağır
      const response = await fetch('/api/update-table');
      
      if (!response.ok) {
        throw new Error('Tablo güncelleme isteği başarısız oldu: ' + response.statusText);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStatus({ 
          message: data.message || "Tablo başarıyla güncellendi.",
          isSuccess: true,
          isError: false
        });
        setTableInfo(data.tableStructure);
      } else {
        setStatus({ 
          message: data.message || "Tablo güncellenirken bir hata oluştu.",
          isSuccess: false,
          isError: true
        });
      }
    } catch (error) {
      console.error('Tablo güncelleme hatası:', error);
      setStatus({ 
        message: "Tablo güncellenirken bir hata oluştu: " + error.message,
        isSuccess: false,
        isError: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen bg-amber-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-amber-800">Yetkisiz Erişim</h1>
            <p className="text-gray-600 mt-2">Bu sayfaya erişmek için yönetici girişi yapmanız gerekmektedir.</p>
          </div>
          <div className="flex justify-center">
            <Link href="/admin" className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded transition duration-300">
              Yönetici Girişine Git
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <main className="container mx-auto px-6 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-blue-800 mb-6">Tablo Güncelleme</h1>
          
          {status.message && (
            <div className={`p-4 mb-6 rounded ${
              status.isError 
                ? 'bg-red-100 border-l-4 border-red-500 text-red-700' 
                : status.isSuccess 
                  ? 'bg-green-100 border-l-4 border-green-500 text-green-700'
                  : 'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
            }`}>
              <p>{status.message}</p>
            </div>
          )}
          
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Bu sayfa, veritabanı tablonuzu güncellemek ve <strong>görsel sütunu (image_url)</strong> eklemek için kullanılır.
              Bu işlem yalnızca bir kez yapılmalıdır. Eğer tablonuz zaten güncel ise, herhangi bir değişiklik yapılmayacaktır.
            </p>
            <button
              onClick={handleUpdateTable}
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded transition duration-300 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Güncelleniyor...
                </span>
              ) : "Tabloyu Güncelle"}
            </button>
          </div>
          
          {tableInfo && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-amber-800 mb-4">Mevcut Tablo Yapısı:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">Alan</th>
                      <th className="border px-4 py-2 text-left">Tip</th>
                      <th className="border px-4 py-2 text-left">Null</th>
                      <th className="border px-4 py-2 text-left">Anahtar</th>
                      <th className="border px-4 py-2 text-left">Varsayılan</th>
                      <th className="border px-4 py-2 text-left">Ekstra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableInfo.map((column, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="border px-4 py-2">{column.Field}</td>
                        <td className="border px-4 py-2">{column.Type}</td>
                        <td className="border px-4 py-2">{column.Null}</td>
                        <td className="border px-4 py-2">{column.Key}</td>
                        <td className="border px-4 py-2">{column.Default === null ? 'NULL' : column.Default}</td>
                        <td className="border px-4 py-2">{column.Extra}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              <strong>Not:</strong> Tablo güncellemesi başarılı olduktan sonra, görsel yükleme özelliğini kullanabilirsiniz.
              Herhangi bir sorun yaşarsanız, veritabanı yöneticinize başvurun.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 
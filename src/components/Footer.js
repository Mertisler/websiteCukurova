import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-amber-600 text-white mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">BALİZ PARMAK KULÜBÜ</h3>
            <p className="mb-4 text-amber-100">
              Güncel duyurular ve haberler için tek adres.
            </p>
            <p className="text-amber-200 text-sm">
              &copy; {currentYear} Tüm hakları saklıdır.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-amber-100 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-amber-100 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-amber-100 hover:text-white transition-colors">
                  Yönetici Girişi
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-6 items-center">
          <a href="https://www.instagram.com/balizparmak.01?igsh=M254ODh0d25ibXNh" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-white transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1-5.25 5.25A5.25 5.25 0 0 1 12 6.75zm0 1.5a3.75 3.75 0 1 0 3.75 3.75A3.75 3.75 0 0 0 12 8.25zm5.5-.75a1 1 0 1 1-1 1a1 1 0 0 1 1-1z"/>
            </svg>
            Instagram
          </a>
          <a href="mailto:balparmakkulubu@gmail.com" className="text-amber-100 hover:text-white transition-colors flex items-center" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
              <path d="M2.01 6.51A2.25 2.25 0 0 1 4.25 5h15.5a2.25 2.25 0 0 1 2.24 1.51l-10 6.25l-10-6.25zm-.01 2.36v8.63A2.25 2.25 0 0 0 4.25 21h15.5a2.25 2.25 0 0 0 2.25-2.25V8.87l-9.47 5.91a.75.75 0 0 1-.78 0L2 8.87z"/>
            </svg>
            balparmakkulubu@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
} 
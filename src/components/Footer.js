import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-amber-600 text-white mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <Link href="/iletisim" className="text-amber-100 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-amber-100 hover:text-white transition-colors">
                  Yönetici Girişi
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">İletişim</h3>
            <address className="not-italic text-amber-100">
              <p className="mb-2">Adana, Türkiye</p>
              <p className="mb-2">
                <a href="mailto:info@balkupu.com" className="hover:text-white transition-colors">
                  info@balkupu.com
                </a>
              </p>
              <p>
                <a href="tel:+901234567890" className="hover:text-white transition-colors">
                  +90 123 456 7890
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
} 
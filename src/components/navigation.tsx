'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Calculator, Home, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Calculadora SUNAT', href: '/sunat-calculator', icon: Calculator },
  { name: 'Documentación', href: '/documentation', icon: FileText },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b border-[#E0E0E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="SUNAT Logo" 
                width={48} 
                height={48} 
                className="h-12 w-12"
              />
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:space-x-0">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div key={item.name} className="relative">
                  <Link
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-6 py-5 text-sm font-medium transition-all duration-200 relative',
                      isActive
                        ? 'text-[#B71C1C] bg-gray-50'
                        : 'text-[#333333] hover:bg-gray-50 hover:text-[#666666]'
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#B71C1C]"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

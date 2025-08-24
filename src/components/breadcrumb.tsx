'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  href?: string;
  isActive?: boolean;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="bg-white border-b border-[#E0E0E0] py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link 
              href="/" 
              className="flex items-center text-[#1976D2] hover:text-[#004C97] transition-colors duration-200"
            >
              <Home className="h-4 w-4 mr-1" />
              Inicio
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
              {item.href && !item.isActive ? (
                <Link 
                  href={item.href}
                  className="text-[#1976D2] hover:text-[#004C97] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={item.isActive ? "text-[#666666]" : "text-[#666666]"}>
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

'use client';

import { usePathname } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export function useBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname();
  
  const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
    '/': [],
    '/sunat-calculator': [
      { label: 'Calculadora SUNAT', href: '/sunat-calculator', isActive: true }
    ],
    '/documentation': [
      { label: 'Documentación', href: '/documentation', isActive: true }
    ],
    '/settings': [
      { label: 'Configuración', href: '/settings', isActive: true }
    ]
  };

  return breadcrumbMap[pathname] || [];
}

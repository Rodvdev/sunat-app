'use client';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';
import { Breadcrumb } from './breadcrumb';
import { usePathname } from 'next/navigation';

export function BreadcrumbProvider() {
  const pathname = usePathname();
  const breadcrumbItems = useBreadcrumb();
  
  // Add deductible expenses breadcrumb if we're on that route
  if (pathname === '/results/deductibles') {
    const updatedItems = [
      ...breadcrumbItems,
      {
        label: 'Gastos Deducibles',
        href: '/results/deductibles',
        isActive: true
      }
    ];
    return <Breadcrumb items={updatedItems} />;
  }
  
  return <Breadcrumb items={breadcrumbItems} />;
}

'use client';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';
import { Breadcrumb } from './breadcrumb';

export function BreadcrumbProvider() {
  const breadcrumbItems = useBreadcrumb();
  return <Breadcrumb items={breadcrumbItems} />;
}

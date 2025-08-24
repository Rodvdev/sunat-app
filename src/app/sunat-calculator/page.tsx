'use client';

import { Calculator } from 'lucide-react';
import { SunatCalculatorForm } from '@/components/sunat-calculator-form';

export default function SunatCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#E3F2FD] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#004C97] mb-4">
            Calculadora SUNAT 2025
          </h1>
          <p className="text-xl text-[#666666]">
            Calcula tus retenciones de impuestos y gastos deducibles según la normativa peruana
          </p>
        </div>

        {/* Input Form - Full Width */}
        <div className="mb-8">
          <SunatCalculatorForm />
        </div>
      </div>
    </div>
  );
}

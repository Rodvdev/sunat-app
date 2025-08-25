'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { SunatCalculatorForm } from '@/components/sunat-calculator-form';

export default function SunatCalculatorPage() {
  const [currentStepInfo, setCurrentStepInfo] = useState({
    title: 'Calculadora SUNAT 2025',
    description: 'Calcula tus retenciones de impuestos y gastos deducibles según la normativa peruana',
    stepNumber: 0,
    totalSteps: 3
  });

  return (
    <div className="min-h-screen bg-[#E3F2FD] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Dynamic Step Information */}
        <div className="mb-8 text-center">
          <div className="mb-4">
            {currentStepInfo.stepNumber > 0 && (
              <div className="inline-flex items-center px-4 py-2 bg-[#004C97] text-white rounded-full text-sm font-medium mb-4">
                Paso {currentStepInfo.stepNumber} de {currentStepInfo.totalSteps}
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-[#004C97] mb-4">
            {currentStepInfo.title}
          </h1>
          <p className="text-xl text-[#666666] max-w-4xl mx-auto">
            {currentStepInfo.description}
          </p>
        </div>

        {/* Input Form - Full Width */}
        <div className="mb-8">
          <SunatCalculatorForm onStepChange={setCurrentStepInfo} />
        </div>
      </div>
    </div>
  );
}

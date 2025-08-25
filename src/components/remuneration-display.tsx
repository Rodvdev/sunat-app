import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useRemunerationCalculator } from '../hooks/use-remuneration-calculator';
import { UseFormWatch } from 'react-hook-form';

interface FormData {
  year: number;
  monthlyIncome: number;
  additionalIncomeByMonth: { month: number; amount: number }[];
  additionalIncome: number;
  additionalMonth: number;
  calculationMonth: number;
  previousRetentions: number;
  roundingDecimals: number;
  // Deductible expenses
  restaurants: number;
  medicalServices: number;
  professionalServices: number;
  rentalProperties: number;
  essaludContributions: number;
  // Nuevos campos para ingresos adicionales
  gratificaciones: number;
  bonificaciones: number;
  utilidades: number;
  cts: number;
  asignacionFamiliar: number;
  // Campos para configuración de meses
  gratificacionesMonth?: number;
  bonificacionesMonth?: number;
  utilidadesMonth?: number;
  ctsMonth?: number;
  asignacionFamiliarMonth?: number;
  // Campos para configuración de cálculos automáticos
  calculateGratificaciones: boolean;
  calculateCTS: boolean;
  calculateAsignacionFamiliar: boolean;
  // Campos para gratificaciones
  insuranceType: 'essalud' | 'eps';
  startWorkMonth: number;
  // Campos para asignación familiar
  hasChildren: boolean;
  childrenCount: number;
  childrenStudying: boolean;
  // Campos para contratos de duración limitada
  isLimitedContract: boolean;
  contractEndMonth?: number;
  // Campo para sector público
  isPublicSectorWorker: boolean;
  // Campo para bono por escolaridad del sector público
  receivesSchoolingBonus: boolean;
  // Campos para bono extraordinario judicial
  isJudicialWorker: boolean;
  judicialInstitution?: 'poder_judicial' | 'inpe' | 'ministerio_publico';
  isDirectivePosition: boolean;
}

interface RemunerationDisplayProps {
  watch: UseFormWatch<FormData>;
  currentStep: number;
}

// Función para obtener el nombre del mes
const getMonthName = (monthNumber: number): string => {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return monthNames[monthNumber - 1] || 'Mes inválido';
};

export const RemunerationDisplay = ({ watch, currentStep }: RemunerationDisplayProps) => {
  const calculation = useRemunerationCalculator(watch);
  const values = watch();

  if (currentStep < 1) return null;
  
  // Solo mostrar si hay datos relevantes
  if (!calculation.RBA || calculation.RBA === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-[#666666]">Mes de Inicio:</span>
          <div className="font-semibold text-[#333333]">
            {getMonthName(values.startWorkMonth || 1)}
          </div>
        </div>
        
        <div>
          <span className="text-[#666666]">Meses Restantes:</span>
          <div className="font-semibold text-[#333333]">
            {calculation.remainingMonths === 12 ? 'Todo el año' : `${calculation.remainingMonths} meses`}
          </div>
        </div>
        
        <div>
          <span className="text-[#666666]">Remuneración Bruta Anual (RBA):</span>
          <div className="font-bold text-[#2E7D32] text-lg">
            S/ {calculation.RBA.toLocaleString()}
          </div>
        </div>
        
        {currentStep >= 2 && calculation.rna > 0 && (
          <div>
            <span className="text-[#666666]">Remuneración Neta Anual (RNA):</span>
            <div className="font-bold text-[#1976D2] text-lg">
              S/ {calculation.rna.toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

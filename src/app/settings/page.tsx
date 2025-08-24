import { Settings, Palette, Globe, Bell, Shield, Database, Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SettingItem = 
  | {
      label: string;
      type: 'select';
      options: string[];
      defaultValue: string;
    }
  | {
      label: string;
      type: 'input';
      placeholder: string;
      defaultValue: string;
    }
  | {
      label: string;
      type: 'button';
      buttonText: string;
      buttonVariant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    };

type SettingCategory = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  settings: SettingItem[];
};

const settingCategories: SettingCategory[] = [
  {
    icon: Palette,
    title: 'Apariencia',
    description: 'Personaliza la interfaz de la aplicación',
    settings: [
      {
        label: 'Tema',
        type: 'select',
        options: ['Claro', 'Oscuro', 'Automático'],
        defaultValue: 'Claro'
      },
      {
        label: 'Densidad de la interfaz',
        type: 'select',
        options: ['Compacta', 'Normal', 'Espaciada'],
        defaultValue: 'Normal'
      }
    ]
  },
  {
    icon: Globe,
    title: 'Idioma y Región',
    description: 'Configura el idioma y formato de moneda',
    settings: [
      {
        label: 'Idioma',
        type: 'select',
        options: ['Español', 'English'],
        defaultValue: 'Español'
      },
      {
        label: 'Moneda',
        type: 'select',
        options: ['PEN (S/)', 'USD ($)', 'EUR (€)'],
        defaultValue: 'PEN (S/)'
      },
      {
        label: 'Formato de fecha',
        type: 'select',
        options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
        defaultValue: 'DD/MM/YYYY'
      }
    ]
  },
  {
    icon: Calculator,
    title: 'Calculadora',
    description: 'Configuración específica de la calculadora SUNAT',
    settings: [
      {
        label: 'Decimales por defecto',
        type: 'select',
        options: ['0', '1', '2', '3', '4'],
        defaultValue: '2'
      },
      {
        label: 'Año por defecto',
        type: 'input',
        placeholder: '2025',
        defaultValue: '2025'
      },
      {
        label: 'Mostrar observaciones',
        type: 'select',
        options: ['Sí', 'No'],
        defaultValue: 'Sí'
      }
    ]
  },
  {
    icon: Bell,
    title: 'Notificaciones',
    description: 'Gestiona las alertas y recordatorios',
    settings: [
      {
        label: 'Recordatorios de pago',
        type: 'select',
        options: ['Activados', 'Desactivados'],
        defaultValue: 'Activados'
      },
      {
        label: 'Notificaciones por email',
        type: 'select',
        options: ['Activadas', 'Desactivadas'],
        defaultValue: 'Desactivadas'
      }
    ]
  },
  {
    icon: Shield,
    title: 'Privacidad y Seguridad',
    description: 'Configuración de seguridad y privacidad',
    settings: [
      {
        label: 'Guardar historial localmente',
        type: 'select',
        options: ['Sí', 'No'],
        defaultValue: 'Sí'
      },
      {
        label: 'Cifrado de datos',
        type: 'select',
        options: ['Activado', 'Desactivado'],
        defaultValue: 'Activado'
      }
    ]
  },
  {
    icon: Database,
    title: 'Datos y Almacenamiento',
    description: 'Gestiona el almacenamiento y exportación de datos',
    settings: [
      {
        label: 'Exportar cálculos',
        type: 'button',
        buttonText: 'Exportar Historial',
        buttonVariant: 'outline'
      },
      {
        label: 'Limpiar datos',
        type: 'button',
        buttonText: 'Limpiar Todo',
        buttonVariant: 'destructive'
      }
    ]
  }
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#E3F2FD] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#004C97] mb-4">
            Configuración
          </h1>
          <p className="text-xl text-[#666666] max-w-2xl mx-auto">
            Personaliza la aplicación según tus preferencias y necesidades
          </p>
        </div>

        {/* Settings Categories */}
        <div className="space-y-8">
          {settingCategories.map((category) => (
            <Card key={category.title} className="border-[#E0E0E0] shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#E3F2FD] rounded-lg">
                    <category.icon className="h-6 w-6 text-[#004C97]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-[#004C97]">{category.title}</CardTitle>
                    <CardDescription className="text-base text-[#666666]">
                      {category.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.settings.map((setting) => (
                    <div key={setting.label} className="space-y-2">
                      <Label className="text-sm font-medium text-[#333333]">
                        {setting.label}
                      </Label>
                      
                      {setting.type === 'select' && (
                        <Select defaultValue={setting.defaultValue}>
                          <SelectTrigger className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30">
                            <SelectValue placeholder="Selecciona una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            {setting.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      
                      {setting.type === 'input' && (
                        <Input 
                          placeholder={setting.placeholder} 
                          defaultValue={setting.defaultValue}
                          className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30"
                        />
                      )}
                      
                      {setting.type === 'button' && (
                        <Button 
                          variant={setting.buttonVariant} 
                          className="w-full"
                        >
                          {setting.buttonText}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-12 text-center">
          <Button size="lg" className="px-8 py-3 bg-[#004C97] hover:bg-[#1976D2] border-0">
            <Settings className="mr-2 h-5 w-5" />
            Guardar Configuración
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-[#E3F2FD] rounded-lg p-6 border border-[#1976D2]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[#004C97] mb-2">
              ¿Necesitas ayuda?
            </h3>
            <p className="text-[#004C97] mb-4">
              Si tienes problemas con la configuración o necesitas asistencia técnica, 
              consulta nuestra documentación o contacta al soporte.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" size="sm" className="border-[#004C97] text-[#004C97] hover:bg-[#004C97] hover:text-white">
                Ver Documentación
              </Button>
              <Button variant="outline" size="sm" className="border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white">
                Contactar Soporte
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

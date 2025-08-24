'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, AlertTriangle, CheckCircle, Info, ExternalLink, Calculator } from 'lucide-react';

export default function GastosDeduciblesPage() {
  return (
    <div className="min-h-screen bg-[#E3F2FD] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#004C97] mb-4">
            Gastos Deducibles SUNAT 2025
          </h1>
          <p className="text-xl text-[#666666]">
            Guía completa de gastos deducibles para el ejercicio fiscal 2025
          </p>
        </div>

        {/* Resumen Ejecutivo */}
        <Card className="mb-8 border-[#E0E0E0] shadow-sm">
          <CardHeader className="bg-[#004C97] text-white">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Resumen Ejecutivo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-3">¿Qué son los Gastos Deducibles?</h3>
                <p className="text-[#666666] mb-4">
                  Los gastos deducibles son desembolsos que pueden restarse de los ingresos anuales para reducir el impuesto a la renta a pagar. Para el año 2025, estos gastos aplican únicamente cuando los ingresos anuales superan las 7 UIT (S/ 37,450).
                </p>
                <div className="bg-[#E8F5E8] p-4 rounded-lg border border-[#4CAF50]">
                  <h4 className="font-semibold text-[#2E7D32] mb-2">Límite Máximo de Deducción</h4>
                  <ul className="text-sm text-[#2E7D32] space-y-1">
                    <li>• <strong>Deducción Adicional de 3 UIT</strong>: S/ 16,050 para el año 2025</li>
                    <li>• <strong>Base de cálculo</strong>: Suma de porcentajes aplicados según tipo de gasto</li>
                    <li>• <strong>Restricción</strong>: No puede exceder 3 UIT bajo ninguna circunstancia</li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-3">Proceso de Cálculo</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#004C97] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-[#666666]">Ingresos brutos anuales</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#004C97] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-[#666666]">Menos: Deducción estándar de 7 UIT</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#004C97] text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-[#666666]">Menos: Deducción adicional de 3 UIT (gastos deducibles)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#004C97] text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <span className="text-[#666666]">Resultado: Renta neta imponible</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#004C97] text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                    <span className="text-[#666666]">Aplicación: Escala progresiva de impuestos</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Gastos Deducibles */}
        <Card className="mb-8 border-[#E0E0E0] shadow-sm">
          <CardHeader className="bg-[#2E7D32] text-white">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Tipos de Gastos Deducibles 2025
            </CardTitle>
            <CardDescription className="text-[#E8F5E8]">
              Categorías y porcentajes de deducción aplicables
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Restaurantes */}
              <div className="border border-[#E0E0E0] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#333333] mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#FF9800] rounded-full"></span>
                  Restaurantes, Bares y Hoteles
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Porcentaje:</span>
                    <span className="font-semibold text-[#2E7D32]">15%</span>
                  </div>
                  <div className="text-sm text-[#666666]">
                    <p className="font-medium mb-2">Requisitos obligatorios:</p>
                    <ul className="space-y-1">
                      <li>• Comprobante debe identificar al usuario con DNI o RUC</li>
                      <li>• Negocio debe estar Activo en RUC</li>
                      <li>• Condición de Habido (o regularizar al 31.12.2025)</li>
                      <li>• CIIU 55 (hoteles) o 56 (restaurantes)</li>
                      <li>• Para montos ≥ S/ 2,000: medios de pago electrónicos</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Servicios Médicos */}
              <div className="border border-[#E0E0E0] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#333333] mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#2196F3] rounded-full"></span>
                  Servicios Médicos y Odontológicos
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Porcentaje:</span>
                    <span className="font-semibold text-[#2E7D32]">30%</span>
                  </div>
                  <div className="text-sm text-[#666666]">
                    <p className="font-medium mb-2">Requisitos obligatorios:</p>
                    <ul className="space-y-1">
                      <li>• Recibo por honorarios electrónico</li>
                      <li>• Profesional registrado en SUNAT</li>
                      <li>• Identificación del usuario con DNI o RUC</li>
                      <li>• Para montos ≥ S/ 2,000: medios de pago electrónicos</li>
                      <li>• Emisor no debe estar "no habido" o de baja en RUC</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Servicios Profesionales */}
              <div className="border border-[#E0E0E0] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#333333] mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#9C27B0] rounded-full"></span>
                  Servicios Profesionales y Oficios
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Porcentaje:</span>
                    <span className="font-semibold text-[#2E7D32]">30%</span>
                  </div>
                  <div className="text-sm text-[#666666]">
                    <p className="font-medium mb-2">Requisitos obligatorios:</p>
                    <ul className="space-y-1">
                      <li>• Recibo por honorarios electrónico (desde 01.04.2017)</li>
                      <li>• Identificación del usuario con DNI o RUC</li>
                      <li>• Para montos ≥ S/ 2,000: medios de pago electrónicos</li>
                      <li>• Emisor no debe estar "no habido" o de baja en RUC</li>
                    </ul>
                    <div className="mt-2 p-2 bg-[#FFF3E0] rounded border border-[#FF9800]">
                      <p className="text-xs text-[#E65100] font-medium">Excluidos: Director, síndico, mandatario, gestor, albacea, regidor municipal, consejero regional</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alquiler */}
              <div className="border border-[#E0E0E0] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#333333] mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#607D8B] rounded-full"></span>
                  Alquiler de Inmuebles
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Porcentaje:</span>
                    <span className="font-semibold text-[#2E7D32]">30%</span>
                  </div>
                  <div className="text-sm text-[#666666]">
                    <p className="font-medium mb-2">Requisitos obligatorios:</p>
                    <ul className="space-y-1">
                      <li>• Inmueble no destinado exclusivamente a actividades empresariales</li>
                      <li>• Ubicado en Perú</li>
                      <li>• Documentación según tipo de arrendador</li>
                      <li>• Para montos ≥ S/ 2,000: medios de pago electrónicos</li>
                      <li>• Emisor no debe estar "no habido" o de baja en RUC</li>
                    </ul>
                    <div className="mt-2 p-2 bg-[#E3F2FD] rounded border border-[#2196F3]">
                      <p className="text-xs text-[#1976D2] font-medium">Atribución: Hasta 50% puede trasladarse a cónyuge o concubino</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* EsSalud */}
              <div className="border border-[#E0E0E0] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#333333] mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#F44336] rounded-full"></span>
                  Aportaciones a EsSalud
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Porcentaje:</span>
                    <span className="font-semibold text-[#2E7D32]">100%</span>
                  </div>
                  <div className="text-sm text-[#666666]">
                    <p className="font-medium mb-2">Requisitos obligatorios:</p>
                    <ul className="space-y-1">
                      <li>• Inscripción del trabajador en "Registro del Trabajador del Hogar" (MTPE)</li>
                      <li>• Derechohabientes registrados en SUNAT Virtual</li>
                      <li>• Formulario N° 1676 (físico o virtual)</li>
                      <li>• Aporte del 9% de la remuneración</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requisitos Generales */}
        <Card className="mb-8 border-[#E0E0E0] shadow-sm">
          <CardHeader className="bg-[#FF9800] text-white">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Requisitos Generales para Todos los Gastos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-3">Identificación del Usuario</h3>
                <ul className="space-y-2 text-[#666666]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span><strong>DNI:</strong> Para personas naturales peruanas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span><strong>RUC:</strong> Para personas naturales extranjeras domiciliadas en Perú</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span><strong>Campo obligatorio:</strong> Debe aparecer en "DNI" o "RUC", NO en observaciones</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-3">Medios de Pago</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-[#FFF3E0] rounded border border-[#FF9800]">
                    <p className="font-medium text-[#E65100] mb-2">Montos ≥ S/ 2,000 o US$ 500:</p>
                    <ul className="text-sm text-[#E65100] space-y-1">
                      <li>• Transferencia bancaria</li>
                      <li>• Depósito en cuenta</li>
                      <li>• Tarjeta de débito o crédito</li>
                      <li>• Cheques</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-[#E8F5E8] rounded border border-[#4CAF50]">
                    <p className="font-medium text-[#2E7D32]">Montos < S/ 2,000:</p>
                    <p className="text-sm text-[#2E7D32]">Sin restricción de medio de pago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-3">Estado del Emisor</h3>
                <ul className="space-y-2 text-[#666666]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span><strong>Condición de Habido:</strong> Emisor debe estar habido o regularizar al 31.12.2025</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span><strong>Estado RUC:</strong> Emisor no debe estar de baja en inscripción</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span><strong>Actividad económica:</strong> Debe corresponder al servicio prestado</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-3">Fechas de Emisión</h3>
                <ul className="space-y-2 text-[#666666]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span><strong>Vigencia:</strong> Comprobantes emitidos hasta el 31 de diciembre de 2025</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span><strong>Registro de pagos:</strong> Para servicios profesionales, pagos registrados hasta 31.12.2025</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plataforma de Gastos */}
        <Card className="mb-8 border-[#E0E0E0] shadow-sm">
          <CardHeader className="bg-[#1976D2] text-white">
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Plataforma de Gastos Deducibles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-3">Acceso</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <ExternalLink className="h-5 w-5 text-[#1976D2]" />
                    <div>
                      <p className="font-medium">Portal web</p>
                      <a href="https://www.sunat.gob.pe" target="_blank" rel="noopener noreferrer" className="text-[#1976D2] hover:underline">www.sunat.gob.pe</a>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <ExternalLink className="h-5 w-5 text-[#1976D2]" />
                    <div>
                      <p className="font-medium">App móvil</p>
                      <span className="text-[#666666]">App Personas</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#4CAF50]" />
                    <div>
                      <p className="font-medium">Credenciales</p>
                      <span className="text-[#666666]">RUC y Clave SOL</span>
                    </div>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-[#E3F2FD] rounded border border-[#1976D2]">
                  <p className="text-sm text-[#1976D2]">
                    <strong>Excepción:</strong> Solo DNI y Clave SOL para trabajadores en planilla (quinta categoría)
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-3">Funcionalidades</h3>
                <ul className="space-y-2 text-[#666666]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span>Eliminar Boletas de Venta Electrónicas en gastos de restaurantes y hoteles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span>Eliminar ítems en gastos de alquileres, servicios profesionales y trabajadores del hogar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span>Verificar información de gastos registrados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span>Consulta de gastos registrados en el sistema SUNAT</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#FFF3E0] rounded-lg border border-[#FF9800]">
              <h4 className="font-semibold text-[#E65100] mb-2">Consideraciones Importantes</h4>
              <ul className="text-sm text-[#E65100] space-y-1">
                <li>• <strong>Retraso en visualización:</strong> Hasta 7 días calendario después de la emisión</li>
                <li>• <strong>Registro manual:</strong> Gastos no visibles pueden registrarse directamente en declaración</li>
                <li>• <strong>Validación:</strong> Verificar que el negocio tenga la actividad económica correcta en RUC</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Ejemplo Práctico */}
        <Card className="mb-8 border-[#E0E0E0] shadow-sm">
          <CardHeader className="bg-[#4CAF50] text-white">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Ejemplo Práctico de Cálculo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-[#E8F5E8] p-6 rounded-lg border border-[#4CAF50]">
              <h3 className="text-lg font-semibold text-[#2E7D32] mb-4">Caso: Trabajador con Gastos Deducibles</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Ingresos anuales:</span>
                  <span className="font-semibold">S/ 50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Deducción 7 UIT:</span>
                  <span className="font-semibold">S/ 37,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Deducción 3 UIT (gastos):</span>
                  <span className="font-semibold">S/ 16,050</span>
                </div>
                <div className="border-t border-[#4CAF50] pt-2">
                  <div className="flex justify-between font-semibold text-[#2E7D32]">
                    <span>Renta neta:</span>
                    <span>S/ 0 (no hay impuesto a pagar)</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#2E7D32] mt-3">
                En este caso, el trabajador no paga impuesto a la renta porque sus deducciones (7 UIT + 3 UIT) 
                igualan o superan sus ingresos anuales.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contacto y Enlaces */}
        <Card className="border-[#E0E0E0] shadow-sm">
          <CardHeader className="bg-[#666666] text-white">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Contacto y Enlaces de Referencia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-3">Canales de Atención</h3>
                <ul className="space-y-2 text-[#666666]">
                  <li>• <strong>Portal web:</strong> <a href="https://www.sunat.gob.pe" target="_blank" rel="noopener noreferrer" className="text-[#1976D2] hover:underline">www.sunat.gob.pe</a></li>
                  <li>• <strong>App móvil:</strong> App Personas (descarga desde tiendas de aplicaciones)</li>
                  <li>• <strong>Centros de atención:</strong> Oficinas SUNAT a nivel nacional</li>
                  <li>• <strong>Línea telefónica:</strong> Consultar horarios en portal oficial</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-3">Documentación de Referencia</h3>
                <ul className="space-y-2 text-[#666666]">
                  <li>• <a href="https://www.sunat.gob.pe" target="_blank" rel="noopener noreferrer" className="text-[#1976D2] hover:underline">Portal SUNAT</a></li>
                  <li>• <a href="https://www.sunat.gob.pe/app-personas" target="_blank" rel="noopener noreferrer" className="text-[#1976D2] hover:underline">App Personas</a></li>
                  <li>• <a href="https://www.sunat.gob.pe/descarga/formularios" target="_blank" rel="noopener noreferrer" className="text-[#1976D2] hover:underline">Formularios virtuales</a></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-[#FFF3E0] rounded-lg border border-[#FF9800]">
              <p className="text-sm text-[#E65100]">
                <strong>Nota:</strong> Esta documentación está basada en la normativa vigente para el ejercicio 2025. 
                Para información actualizada, consultar siempre las fuentes oficiales de SUNAT.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

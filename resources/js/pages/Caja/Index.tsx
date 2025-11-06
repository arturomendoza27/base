import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, Receipt, Printer, Banknote, CreditCard, DollarSign } from "lucide-react";
import { DashboardLayout } from "../dashboard/dashboard-layout";
import { Factura, Filters, PaginatedData } from "@/types";
import { numberToWords } from "@/lib/number-to-words";
import { formatoPesos } from '@/lib/fomato_numeros';
import { useForm } from "@inertiajs/react";

interface IndexProps {
  datos: PaginatedData<Factura>;
  filters: Filters;
}

export default function CajaPage({ datos = {}, filters = {} }: IndexProps) {
  // Estados generales
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [filteredFacturas, setFilteredFacturas] = useState<Factura[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Factura | null>(null);
  const [showList, setShowList] = useState(false);
  const { flash } = usePage().props as unknown as { flash?: { success?: string } };
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer">("cash");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    factura_id: '',
    valor_pagado: '',
    medio_pago: '',
    recibo_banco: '',
    recibo_numero: '',
    recibo_fecha: ''
  });

  // Cerrar lista si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (paymentMethod === "cash") {
      setData("medio_pago", "Efectivo");
      setData("recibo_banco", "");
      setData("recibo_numero", "");
      setData("recibo_fecha", "");
      setData("valor_pagado", "");
    } else if (paymentMethod === "transfer") {
      setData("valor_pagado", "");
      setData("medio_pago", "Transferencia");
    }
  }, [paymentMethod]);

  const onInputChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim().length === 0) {
      setShowList(false);
      setFilteredFacturas([]);
      return;
    }

    // Filtra localmente las facturas recibidas desde Laravel
    const filtered = datos.data.filter((inv) => {
      const nombre = inv.predio?.cliente?.nombre?.toLowerCase() || "";
      const id = inv.id.toString().toLowerCase();
      const term = value.toLowerCase();
      return nombre.includes(term) || id.includes(term);
    });
    setFilteredFacturas(filtered);
    setShowList(filtered.length > 0);
  };

  const handleSelectFactura = (factura: Factura) => {
    setSelectedInvoice(factura);
    setSearchTerm(`${factura.id} - ${factura.predio?.cliente?.nombre ?? ""}`);
    setShowList(false);
  };

  // Calcular vuelto
  const receivedAmountNum = parseFloat(data.valor_pagado) || 0;
  const change = selectedInvoice?.total_factura ? receivedAmountNum - selectedInvoice.total_factura : 0;

  const handleNewPayment = () => {
    setPaymentCompleted(false);
    data.valor_pagado = "";
    data.recibo_banco = "";
    data.recibo_numero = "";
    data.recibo_fecha = "";
    setSelectedInvoice(null);
    setSearchTerm("");
  };

  const handlePrint = () => {
    window.print();
  };

  //quitar funcionalidad a las fechas de los campo tipo numero
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Bloquear flechas arriba/abajo
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
    // Bloquear PageUp / PageDown
    if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault();
    }
  };

  // Handler para la rueda del mouse
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault(); // evita que el input cambie con la rueda
  };

  type Envelope = {
    title?: string;
    message?: string;
    type?: string;
  };

  type PageProps = {
    messages?: { envelopes?: Envelope[] };
    datos?: any;
  };

  const { messages } = usePage<PageProps>().props;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post('/caja', {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page: any) => {
        if (page.props.messages.title === 'Éxito') {
          const pagoData = page.props.datos ?? null;
          setPaymentData(pagoData);
          setPaymentCompleted(true);
          reset(); // limpiar formulario
        }
      },
      onError: (errs) => {
        console.log(errs);
        setPaymentCompleted(false);
      }
    });
  }

  // Cuando cambie la factura seleccionada
  useEffect(() => {
    if (selectedInvoice?.id) {
      setData('factura_id', selectedInvoice.id.toString());
    }
  }, [selectedInvoice]);

  const invoiceStatus = paymentData?.id && paymentData.id > 0
    ? "pagada"
    : paymentData?.saldo_restante && paymentData.saldo_restante < 0
      ? "abono"
      : selectedInvoice?.estado ?? "pendiente";
  return (
    <DashboardLayout>
      <div className="space-y-6 " >
        <div>
          <h1 className="text-3xl font-bold text-balance">Caja - Punto de Pago</h1>
          <p className="text-muted-foreground">Registro pagos de facturas</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2" >
          {/* ==================== PANEL BUSCADOR ==================== */}
          <Card>
            <CardHeader>
              <CardTitle>Buscar Factura</CardTitle>
              <CardDescription>
                Ingresa número de factura o nombre del usuario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div ref={containerRef} className="relative flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Número de factura o nombre..."
                    value={searchTerm}
                    onChange={(e) => onInputChange(e.target.value)}
                    disabled={paymentCompleted}
                  />
                  {/* Lista desplegable */}
                  {showList && filteredFacturas.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-md mt-1 w-full">
                      {filteredFacturas.map((factura) => (
                        <li
                          key={factura.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectFactura(factura);
                          }}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex justify-between"
                        >
                          <span className="font-medium text-sm">
                            {factura.predio?.cliente?.nombre ?? "Sin nombre"}
                          </span>
                          <span className="text-xs text-gray-500">
                            #{factura.id} — {factura.estado}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Sin resultados */}
                  {showList && filteredFacturas.length === 0 && (
                    <div className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 p-2 text-sm text-gray-500">
                      No se encontraron resultados
                    </div>
                  )}
                </div>
              </div>

              {/* Detalle de factura */}
              {selectedInvoice && (
                <div className="space-y-4">
                  <Separator />
                  <div className="recibo space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Datos de la Factura</h3> <Badge
                        variant="outline"
                        className={
                          invoiceStatus === "pendiente"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : invoiceStatus === "pagada"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : invoiceStatus === "vencida"
                                ? "bg-red-100 text-red-800 border-red-300"
                                : invoiceStatus === "abono"
                                  ? "bg-blue-100 text-blue-800 border-blue-300"
                                  : "bg-gray-200 text-gray-800 border-gray-300"
                        }
                      >
                        {invoiceStatus?.charAt(0).toUpperCase() + invoiceStatus?.slice(1)}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Factura:</span>
                        <span className="font-medium">{selectedInvoice.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Usuario:</span>
                        <span className="font-medium">
                          {selectedInvoice.predio?.cliente?.nombre}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dirección:</span>
                        <span className="font-medium text-right">
                          {selectedInvoice.predio?.direccion_predio}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Teléfono:</span>
                        <span className="font-medium">
                          {selectedInvoice.predio?.cliente?.telefono}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Período:</span>
                        <span className="font-medium">
                          {selectedInvoice.ciclo.mes} - {selectedInvoice.ciclo.anio}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipo de Tarifa:</span>
                        <span className="font-medium">
                          {selectedInvoice.predio.categoria.nombre}
                        </span>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Valor facturado:</span>
                        <span className="font-medium">
                          {formatoPesos(selectedInvoice.saldo_actual)}
                        </span>
                      </div>
                      {selectedInvoice.saldo_anterior > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Saldo pendiente:</span>
                          <span className="font-medium">
                            {formatoPesos(selectedInvoice.saldo_anterior)}
                          </span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold text-lg">Total a Pagar:</span>
                        <span className="font-bold text-2xl text-primary">
                          {formatoPesos(selectedInvoice.total_factura)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ==================== PANEL DE PAGO ==================== */}
          <Card>
            {paymentCompleted ? (
              <CardHeader>
                <CardTitle>Pago registrado</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
            ) : (
              <CardHeader>
                <CardTitle>Registrar Pago</CardTitle>
                <CardDescription>
                  {paymentMethod === "cash"
                    ? "Ingresa el monto recibido en efectivo"
                    : "Ingresa los datos de la transferencia"}
                </CardDescription>
              </CardHeader>
            )}
            <CardContent className="space-y-6">
              {!selectedInvoice ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center space-y-2">
                    <Receipt className="h-12 w-12 mx-auto opacity-50" />
                    <p>Busca una factura para comenzar</p>
                  </div>
                </div>
              ) : paymentCompleted ? (
                <div className="space-y-6" >
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-600">
                          ¡Pago Registrado!
                        </h3>
                        <p className="text-muted-foreground">
                          {flash?.success} El pago se ha procesado correctamente
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detalle del pago */}
                  <div className="panel-pago p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Pago ID:</span>
                      <span className="font-medium">{paymentData?.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Factura ID:</span>
                      <span className="font-medium">{paymentData?.factura_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor Pagado:</span>
                      <span className="font-medium">{formatoPesos(paymentData?.valor_pagado)}</span>
                    </div>
                    <div className="flex justify-between">
                       {paymentData?.saldo_restante >= 0 
                    ? <span>Saldo Pendiente:</span>
                    :<span>Saldo a favor Cliente:</span>}
                      
                      <span className={` ${paymentData?.saldo_restante < 0 ? "font-medium" : "font-medium"}`}>  ${Math.abs(paymentData?.saldo_restante).toLocaleString("es-CO")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Método de Pago:</span>
                      <span className="font-medium">{paymentData?.medio_pago ?? "-"}</span>
                    </div>
                    {paymentData?.medio_pago === "Transferencia" && (
                      <>
                        <div className="flex justify-between">
                          <span>Banco:</span>
                          <span className="font-medium">{paymentData?.recibo_banco ?? "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Número de Referencia:</span>
                          <span className="font-medium">{paymentData?.recibo_numero ?? "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fecha Transferencia:</span>
                          <span className="font-medium">{paymentData?.recibo_fecha ?? "-"}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Botones */}
                  <div className="flex gap-2">
                    <Button onClick={handlePrint} variant="outline">
                      <Printer className="h-4 w-4 mr-2" />
                      Imprimir Recibo
                    </Button>
                    <Button
                      onClick={() => (window.location.href = '/caja')}
                      // onClick={handleNewPayment}
                      className="flex items-center justify-center px-4 py-1 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 rounded-md"
                    >
                      Nuevo Pago
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Método de Pago</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value: "cash" | "transfer") => setPaymentMethod(value)}
                    >
                      <div
                        className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent"
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <RadioGroupItem value="cash" id="cash" />
                        <Label
                          htmlFor="cash"
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <Banknote className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Efectivo</p>
                            <p className="text-xs text-muted-foreground">Pago en efectivo</p>
                          </div>
                        </Label>
                      </div>
                      <div
                        className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent"
                        onClick={() => setPaymentMethod("transfer")}
                      >
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label
                          htmlFor="transfer"
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Transferencia</p>
                            <p className="text-xs text-muted-foreground">
                              Pago por transferencia bancaria
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Separator />
                  <form onSubmit={submit}>
                    {paymentMethod === "cash" ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="received">Monto Recibido</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input type="hidden" name="factura_id" value={selectedInvoice.id} />
                            <Input
                              id="received"
                              type="number"
                              placeholder="0"
                              value={data.valor_pagado}
                              onChange={(e) => setData({ ...data, valor_pagado: e.target.value })}
                              onKeyDown={handleKeyDown}
                              onWheel={handleWheel}
                              onFocus={(e) =>
                                e.target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                              }
                              className="pl-10 text-2xl h-14 font-bold appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              min={0}
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-600 font-medium mb-1">
                              MONTO EN LETRAS:
                            </p>
                            <p className="text-sm font-semibold text-blue-900">
                              {numberToWords(receivedAmountNum)}
                            </p>
                          </div>
                          <Separator />
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Total a Pagar:</span>
                              <span className="font-medium">
                                {formatoPesos(selectedInvoice.total_factura)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Recibido:</span>
                              <span className="font-medium">
                                {formatoPesos(receivedAmountNum)}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-lg">
                                {change > 0
                                  ? "Saldo a favor de cliente"
                                  : change < 0
                                    ? "Saldo pendiente"
                                    : "Total factura pagada"}
                              </span>
                              <span
                                className={`font-bold text-3xl ${change >= 0 ? "text-green-600" : "text-red-600"
                                  }`}
                              >
                                ${Math.abs(change).toLocaleString("es-CO")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="received">Monto Trasnferido</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <Input
                                id="received"
                                type="number"
                                placeholder="0"
                                value={data.valor_pagado}
                                onChange={(e) => setData({ ...data, valor_pagado: e.target.value })}
                                onKeyDown={handleKeyDown}
                                onWheel={handleWheel}
                                onFocus={(e) =>
                                  e.target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                }
                                className="pl-10 text-2xl h-14 font-bold appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min={0}
                              />
                            </div>
                          </div>
                          <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-600 font-medium mb-1">
                              MONTO EN LETRAS:
                            </p>
                            <p className="text-sm font-semibold text-blue-900">
                              {numberToWords(receivedAmountNum)}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="bank">Banco</Label>
                              <Input
                                id="bank"
                                placeholder="Nombre del banco"
                                value={data.recibo_banco}
                                onChange={(e) => setData({ ...data, recibo_banco: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recibo_numero">Número de Referencia</Label>
                              <Input
                                id="recibo_numero"
                                placeholder="Número de referencia de la transferencia"
                                value={data.recibo_numero}
                                onChange={(e) =>
                                  setData({ ...data, recibo_numero: e.target.value })
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="date">Fecha de Transferencia</Label>
                            <Input
                              id="date"
                              type="date"
                              value={data.recibo_fecha}
                              onChange={(e) => setData({ ...data, recibo_fecha: e.target.value })}
                            />
                          </div>
                          <Separator />
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Total a Pagar:</span>
                              <span className="font-medium">
                                {formatoPesos(selectedInvoice.total_factura)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Recibido:</span>
                              <span className="font-medium">
                                {formatoPesos(receivedAmountNum)}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-lg">
                                {change > 0
                                  ? "Saldo a favor de cliente"
                                  : change < 0
                                    ? "Saldo pendiente"
                                    : "Total factura pagada"}
                              </span>
                              <span
                                className={`font-bold text-3xl ${change >= 0 ? "text-green-600" : "text-red-600"
                                  }`}
                              >
                                ${Math.abs(change).toLocaleString("es-CO")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {errors.factura_id && (
                      <div className="text-red-600 text-sm mt-1">{errors.factura_id}</div>
                    )}
                    <Button
                      type="submit"
                      disabled={
                        paymentMethod === "cash"
                          ? !data.valor_pagado
                          : !data.recibo_numero || !data.recibo_banco || !data.recibo_fecha
                      }
                      className="flex items-center justify-center px-4 py-2 h-10 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 rounded-md"
                    >
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      {processing ? 'Guardando...' : ' Registrar pago'}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
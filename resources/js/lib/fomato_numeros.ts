import { usePage } from "@inertiajs/react";

export function formatoPesos(valor: number | string) {
  const numero = Number(valor) || 0
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(numero)
    }
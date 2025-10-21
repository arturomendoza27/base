export function numberToWords(num: number): string {
  if (num === 0) return "CERO PESOS"

  const units = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"]
  const teens = [
    "DIEZ",
    "ONCE",
    "DOCE",
    "TRECE",
    "CATORCE",
    "QUINCE",
    "DIECISÉIS",
    "DIECISIETE",
    "DIECIOCHO",
    "DIECINUEVE",
  ]
  const tens = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"]
  const hundreds = [
    "",
    "CIENTO",
    "DOSCIENTOS",
    "TRESCIENTOS",
    "CUATROCIENTOS",
    "QUINIENTOS",
    "SEISCIENTOS",
    "SETECIENTOS",
    "OCHOCIENTOS",
    "NOVECIENTOS",
  ]

  function convertLessThanThousand(n: number): string {
    if (n === 0) return ""
    if (n === 100) return "CIEN"

    let result = ""

    // Centenas
    const hundred = Math.floor(n / 100)
    if (hundred > 0) {
      result += hundreds[hundred]
      n %= 100
      if (n > 0) result += " "
    }

    // Decenas y unidades
    if (n >= 10 && n < 20) {
      result += teens[n - 10]
    } else {
      const ten = Math.floor(n / 10)
      const unit = n % 10

      if (ten > 0) {
        result += tens[ten]
        if (unit > 0) {
          result += (ten === 2 ? "" : " Y ") + units[unit]
        }
      } else if (unit > 0) {
        result += units[unit]
      }
    }

    return result
  }

  const integerPart = Math.floor(num)
  const decimalPart = Math.round((num - integerPart) * 100)

  let words = ""

  // Millones
  const millions = Math.floor(integerPart / 1000000)
  if (millions > 0) {
    if (millions === 1) {
      words += "UN MILLÓN"
    } else {
      words += convertLessThanThousand(millions) + " MILLONES"
    }
    if (integerPart % 1000000 > 0) words += " "
  }

  // Miles
  const thousands = Math.floor((integerPart % 1000000) / 1000)
  if (thousands > 0) {
    if (thousands === 1) {
      words += "MIL"
    } else {
      words += convertLessThanThousand(thousands) + " MIL"
    }
    if (integerPart % 1000 > 0) words += " "
  }

  // Unidades
  const remainder = integerPart % 1000
  if (remainder > 0) {
    words += convertLessThanThousand(remainder)
  }

  words += " PESOS"

  if (decimalPart > 0) {
    words += ` CON ${decimalPart.toString().padStart(2, "0")}/100`
  }

  return words.trim()
}

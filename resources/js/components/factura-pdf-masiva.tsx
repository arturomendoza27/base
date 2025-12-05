import { Button } from "@headlessui/react"
import { PlusIcon } from "lucide-react"

function FacturaPdfMasiva({ cicloId }: { cicloId: string | number }) {
  const verFacturaPdf = () => {
    window.open(`/facturacion/${cicloId}/pdf`, "_blank")
  }

  return (
    <Button
      type="button"
      onClick={verFacturaPdf}
      className="
        flex items-center gap-2
        bg-black text-white
        hover:bg-gray-900
        px-4 py-2
        rounded-md
        border border-transparent
        transition
      "
    >
      <PlusIcon className="w-4 h-4" />
      Descargar Facturas
    </Button>
  )
}

export default FacturaPdfMasiva
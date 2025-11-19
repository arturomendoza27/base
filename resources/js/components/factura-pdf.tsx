import { Link } from "@inertiajs/react"
import { EyeIcon, FileTextIcon } from "lucide-react"

function FacturaPdf({ predioId }) {
    const verFacturaPdf = () => {
        window.open(`/facturacion/${predioId}/cliente`, '_blank')
    }

    return (<Link
        onClick={verFacturaPdf}
        className="flex items-center"
    >
        <FileTextIcon className="h-4 w-4 mr-2" />
        Ver Factura
    </Link>)
}

export default FacturaPdf;
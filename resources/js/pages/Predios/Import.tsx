import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react'
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, SaveIcon, XIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import flasher from '@flasher/flasher'
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Predios',
    href: '/predios',
  },
  {
    title: 'Import',
    href: '#',
  },
];




export default function Import() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = (e: any) => {
    e.preventDefault();
    if (!file) return alert('Selecciona un archivo.');

    const formData = new FormData();
    formData.append('archivo', file);

    router.post('/importar-predios', formData, {});
  };
  const downloadUrl = '/templates/importar_predios.xlsx';
  return (
    <DashboardLayout>
      <Head title="Predios" />
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Link href="/predios">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-balance">Importar Predios</h1>
            <p className="text-muted-foreground">Formulario para la carga masiva de predios</p>
           
           
          </div>
        </div>
         <div className="mt-4 p-6 max-w-lg mx-auto border border-green-400 bg-green-50 rounded text-green-700">
             
              <p className="mb-4">
                 La plantilla de Excel a  <span className="font-bold"> importar </span>debe seguir el siguiente formato oficial. Para facilitarte el proceso, puedes descargarla aquí:
              </p>
              <a
                href={downloadUrl}
                download
                className=" flex justify-center px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
              >
                Descargar plantilla de Excel
              </a>
            </div>
        <div className="p-6 max-w-lg mx-auto">
          <form onSubmit={handleImport} method="post" encType="multipart/form-data">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Importar Predios desde Excel</CardTitle>
                  <CardDescription>Sube un archivo Excel para importar múltiples predios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="archivo">
                      Seleccionar Archivo Excel
                    </Label>
                    <Input
                      id="archivo"
                      type="file"
                      name="archivo"
                      accept=".xlsx, .xls"
                      onChange={handleFileChange}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="flex items-center justify-end gap-4">
                <Button
                  type="submit"
                  className="flex items-center justify-center px-4 py-2 h-10 text-sm font-medium bg-green-500 text-white hover:bg-green-600 rounded-md"
                >
                  <SaveIcon className="w-4 h-4 mr-2" />
                  Importar Predios
                </Button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
}

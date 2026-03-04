import { Head, useForm, Link, router } from '@inertiajs/react';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Download, Database, RefreshCw, FileText } from 'lucide-react';

interface BackupPageProps {
    backupExists: boolean;
    backupSize: string;
    lastModified: string | null;
}

export default function Index({ backupExists, backupSize, lastModified }: BackupPageProps) {
    const { post, processing, errors, recentlySuccessful } = useForm();

    const handleGenerateBackup = () => {
        post('/backups/generate');
    };

    const handleDownloadBackup = () => {
        window.location.href = '/backups/download';
    };

    return (
        <DashboardLayout>
            <Head title="Respaldo de Base de Datos" />

            <div className="container mx-auto py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Respaldo de Base de Datos</h1>
                    <p className="text-muted-foreground mt-2">
                        Genera y descarga respaldos manuales de la base de datos del sistema.
                    </p>
                </div>

                {errors && Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {Object.values(errors).map((error, index) => (
                                <div key={index}>{error as string}</div>
                            ))}
                        </AlertDescription>
                    </Alert>
                )}

                {recentlySuccessful && (
                    <Alert className="mb-6 bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Éxito</AlertTitle>
                        <AlertDescription className="text-green-700">
                            Respaldo generado exitosamente.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Estado del Respaldo
                            </CardTitle>
                            <CardDescription>
                                Información sobre el respaldo actual almacenado en el servidor
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Estado</p>
                                        <div className="flex items-center gap-2">
                                            {backupExists ? (
                                                <>
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Respaldo disponible
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Sin respaldo disponible
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {backupExists && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Tamaño</p>
                                                <p className="text-sm text-muted-foreground">{backupSize}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Última modificación</p>
                                                <p className="text-sm text-muted-foreground">{lastModified}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RefreshCw className="h-5 w-5" />
                                Generar Nuevo Respaldo
                            </CardTitle>
                            <CardDescription>
                                Crea un nuevo respaldo de la base de datos. El respaldo anterior será eliminado automáticamente.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Alert>
                                    <FileText className="h-4 w-4" />
                                    <AlertTitle>Importante</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-disc pl-5 space-y-1 mt-2">
                                            <li>Se eliminará automáticamente el respaldo anterior si existe</li>
                                            <li>El respaldo se guardará en: <code className="text-xs">storage/app/backups/backup.sql</code></li>
                                            <li>El servidor debe tener el comando <code className="text-xs">mysqldump</code> disponible</li>
                                            <li>Se requieren permisos de escritura en el directorio de respaldos</li>
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handleGenerateBackup}
                                disabled={processing}
                                className="w-full sm:w-auto"
                            >
                                {processing ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        <Database className="mr-2 h-4 w-4" />
                                        Generar Respaldo
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>

                    {backupExists && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="h-5 w-5" />
                                    Descargar Respaldo
                                </CardTitle>
                                <CardDescription>
                                    Descarga el respaldo actual de la base de datos
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Puedes descargar el respaldo actual las veces que necesites. 
                                    La descarga no eliminará el archivo del servidor.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleDownloadBackup}
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Descargar Respaldo Actual
                                </Button>
                        </CardFooter>
                    </Card>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

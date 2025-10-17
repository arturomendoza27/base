import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface EditProps {
    role: Role;
    rolePermissions: string[];
    permissions: string[];
}

export default function Edit({ role, rolePermissions, permissions }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name || '',
        permissions: rolePermissions || ([] as string[]),
    });

    function handleCheckboxChange(permissionName: string, checked: boolean) {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData('permissions', data.permissions.filter((p) => p !== permissionName));
        }
    }

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/roles/${role.id}`, data);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role create" />
            <div className="p-6 max-w-lg mx-auto">
                <Link
                    href='/roles'
                    className="inline-block mb-6 bg-indigo-600 text-white hover:bg-indigo-700 rounded px-4 py-2 transition"
                >
                    Back
                </Link>
                <form
                    onSubmit={submit}
                    className="bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 space-y-6"
                    aria-label="simple-form"
                >
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Name
                        </label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            type="text"
                            placeholder="Enter name"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                    </div>
                    {/* Permissions */}
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Permissions
                        </label>
                        {permissions.map((permission) => 
                        <div className="flex flex-col gap-3">
                            <label key={permission} className="flex items-center gap-3 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded px-3 py-2 transition">
                                <input
                                    type="checkbox"
                                    value={permission}
                                    onChange={e => handleCheckboxChange(permission, e.target.checked)}
                                    checked={data.permissions.includes(permission)}
                                    id={permission}
                                    className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                                <span className="text-gray-800 font-medium">{permission}</span>
                            </label>
                        </div>
                        )}
                        {errors.permissions && <div className="text-red-600 text-sm mt-1">{errors.permissions}</div>}
                    </div>
          
                    <div className="flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition"
                        >
                            {processing ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

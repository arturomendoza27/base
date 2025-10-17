import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Show',
        href: '#',
    },
];

interface ShowProps {
    role: Role;
    rolePermissions: string[];
}

export default function Show({ role, rolePermissions }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Role: ${role.name}`} />
            <div className="p-6 max-w-4xl mx-auto">
                <Link
                    href="/roles"
                    className="inline-block mb-6 bg-indigo-600 text-white hover:bg-indigo-700 rounded px-4 py-2 transition"
                >
                    Back to Roles
                </Link>

                <div className="bg-white shadow-md rounded-xl p-8 space-y-6">
                    <div className="border-b pb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Role Details</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ID
                            </label>
                            <p className="text-gray-900">{role.id}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Guard Name
                            </label>
                            <p className="text-gray-900">{role.guard_name}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <p className="text-gray-900 text-lg font-semibold">{role.name}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Permissions Count
                            </label>
                            <p className="text-gray-900">
                                {rolePermissions ? rolePermissions.length : 0} permission(s)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Created At
                            </label>
                            <p className="text-gray-900">
                                {new Date(role.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Updated At
                            </label>
                            <p className="text-gray-900">
                                {new Date(role.updated_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Permissions
                        </label>
                        {rolePermissions && rolePermissions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {rolePermissions.map((permission, index) => (
                                    <span
                                        key={index}
                                        className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700"
                                    >
                                        {permission}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No permissions assigned</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';
import { can } from '@/lib/can';
import { type BreadcrumbItem, type PaginatedData, type Role } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

interface IndexProps {
    roles: PaginatedData<Role>;
}

export default function Index({ roles }: IndexProps) {
    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(`/roles/${id}`, {
                preserveScroll: true,
            });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="gap-4 rounded-xl p-4">
                {can('roles.create') && (
                    <Link
                        href="roles/create"
                        className="my-0.5 mr-2 rounded bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700"
                    >
                        Create
                    </Link>
                )}
                <div className="">
                    <div className="flex flex-1 flex-col justify-center overflow-x-auto">
                        <table className="min-w-full flex-1 divide-y divide-gray-200 bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Permissions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {roles.data.map((role) => (
                                    <tr key={role.id}>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {role.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {role.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {role.permissions && role.permissions.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {role.permissions.map((perm) => (
                                                        <span
                                                            key={perm.id}
                                                            className="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"
                                                        >
                                                            {perm.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">No permissions</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {can('roles.view') && (
                                                <Link
                                                    href={`/roles/${role.id}`}
                                                    className="my-0.5 mr-2 rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                                                >
                                                    Show
                                                </Link>
                                            )}
                                            {can('roles.edit') && (
                                                <Link
                                                    href={`/roles/${role.id}/edit`}
                                                    className="my-0.5 mr-2 rounded bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                            {can('roles.delete') && (
                                                <Link
                                                    onClick={() => handleDelete(role.id)}
                                                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                                >
                                                    Delete
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={roles.links} />
                </div>
            </div>
        </AppLayout>
    );
}


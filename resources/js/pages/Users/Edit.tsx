import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface EditProps {
    user: User;
    userRoles: string[];
    roles: string[];
}

export default function Edit({ user, userRoles, roles }: EditProps) {

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        roles: userRoles || []
    });

      function handleCheckboxChange (roleName, checked){
        if(checked){
            setData('roles', [...data.roles, roleName])
        }else{
            setData('roles', data.roles.filter(p => p !== roleName))
        }
    }

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/users/${user.id}`, data);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users edit" />
            <div className="p-6 max-w-lg mx-auto">
                <Link
                    href='/users'
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
                            placeholder="Enter your name"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                    </div>
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <Input
                            id="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            type="email"
                            placeholder="Enter your email"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                    </div>
                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <Input
                            id="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            type="password"
                            placeholder="Enter your password"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}
                    </div>
                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="password_confirmation" className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password
                        </label>
                        <Input
                            id="password_confirmation"
                            value={data.password_confirmation || ''}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            type="password"
                            placeholder="Confirm your password"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.password_confirmation && <div className="text-red-600 text-sm mt-1">{errors.password_confirmation}</div>}
                    </div>
                      {/* Permissions */}
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Roles
                        </label>
                        {roles.map((role) => 
                        <div className="flex flex-col gap-3">
                            <label key={role} className="flex items-center gap-3 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded px-3 py-2 transition">
                                <input
                                    type="checkbox"
                                    value={role}
                                    checked={data.roles.includes(role)}
                                    onChange={e => handleCheckboxChange(role, e.target.checked)}
                                    id={role}
                                    className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                                <span className="text-gray-800 font-medium">{role}</span>
                            </label>
                        </div>
                        )}
                        {errors.roles && <div className="text-red-600 text-sm mt-1">{errors.roles}</div>}
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

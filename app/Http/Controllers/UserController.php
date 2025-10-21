<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = User::when($request->search, function ($query) use ($request) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
        })
            ->with('roles:id,name')
            ->orderBy('created_at', 'desc')
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::select('id', 'name')
            ->orderBy('name')
            ->get()
            ->pluck('name');

        return Inertia::render('Users/Create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
            'roles' => 'required|array|min:1',
            'roles.*' => 'string|exists:roles,name',
        ]);

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            $user->syncRoles($validated['roles']);

            DB::commit();

            return redirect()
                ->route('users.index')
                ->with('success', 'Usuario creado con Exito.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Hafallado en la creación del usuario: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with(['roles:id,name', 'roles.permissions:id,name'])
            ->findOrFail($id);

        return Inertia::render('Users/Show', [
            'user' => $user,
            'userRoles' => $user->roles->pluck('name'),
            'userPermissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::with('roles:id,name')
            ->findOrFail($id);

        $allRoles = Role::select('id', 'name')
            ->orderBy('name')
            ->get()
            ->pluck('name');

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'userRoles' => $user->roles->pluck('name'),
            'roles' => $allRoles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'roles' => 'required|array|min:1',
            'roles.*' => 'string|exists:roles,name',
        ]);

        try {
            DB::beginTransaction();

            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $user->update($userData);
            $user->syncRoles($validated['roles']);

            DB::commit();

            return redirect()
                ->route('users.index')
                ->with('success', 'Datos actualizados correctamente.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Failed to update user: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        try {
            DB::beginTransaction();

            // Prevent deleting the current authenticated user
            if (auth()->id() === $user->id) {
                return redirect()
                    ->back()
                    ->with('error', 'You cannot delete your own account.');
            }

            $user->delete();

            DB::commit();

            return redirect()
                ->route('users.index')
                ->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', 'Failed to delete user: ' . $e->getMessage());
        }
    }
}

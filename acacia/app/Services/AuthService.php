<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;

class AuthService
{
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return [
                'success' => false,
                'message' => 'Credenciales inválidas'
            ];
        }

        // Eliminar tokens anteriores si deseas que sea uno a la vez
        // $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at
            ],
            'token' => $token
        ];
    }

    public function register(array $data): array
    {
        try {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password'])
            ]);

            event(new Registered($user));

            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at
                ],
                'token' => $token
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al crear el usuario'
            ];
        }
    }

    public function logout(): void
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user) {
            $user->currentAccessToken()->delete(); // elimina solo el token actual
            // $user->tokens()->delete(); // elimina todos los tokens (logout global)
        }
    }

    public function getAuthenticatedUser(): ?User
    {
        return Auth::user();
    }

    public function isAuthenticated(): bool
    {
        return Auth::check();
    }
}

<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $result = $this->authService->login($request->email, $request->password);
            
            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Login exitoso',
                    'user' => $result['user'],
                    'token' => $result['token']
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 401);

        }catch (\Exception $e) {
    return response()->json([
        'success' => false,
        'message' => $e->getMessage(), 
        'trace' => $e->getTrace()
    ], 500);
}

    }

    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $result = $this->authService->register($request->all());
            
            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Usuario registrado exitosamente',
                    'user' => $result['user'],
                    'token' => $result['token']
                ], 201);
            }

            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $this->authService->logout();
            
            return response()->json([
                'success' => true,
                'message' => 'Logout exitoso'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cerrar sesión'
            ], 500);
        }
    }
}
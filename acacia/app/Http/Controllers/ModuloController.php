<?php

namespace App\Http\Controllers;

use App\Services\ModuloService;
use Illuminate\Http\JsonResponse;

class ModuloController extends Controller
{
    protected $moduloService;
    public function __construct(ModuloService $moduloService)
    {
        $this->moduloService = $moduloService;
    }

    public function index(): JsonResponse
    {
        try {
            $modulos = $this->moduloService->obtenerTodos();
            return response()->json([
                'success' => true,
                'data' => $modulos
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener modulos',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
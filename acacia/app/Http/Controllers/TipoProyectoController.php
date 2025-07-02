<?php

namespace App\Http\Controllers;

use App\Services\TipoProyectoService;
use Illuminate\Http\JsonResponse;

class TipoProyectoController extends Controller
{
    protected $tipoProyectoService;

    public function __construct(TipoProyectoService $tipoProyectoService)
    {
        $this->tipoProyectoService = $tipoProyectoService;
    }

    public function index(): JsonResponse
    {
        try {
            $tipos = $this->tipoProyectoService->obtenerTodos();
            return response()->json([
                'success' => true,
                'data' => $tipos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los tipos de proyecto',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
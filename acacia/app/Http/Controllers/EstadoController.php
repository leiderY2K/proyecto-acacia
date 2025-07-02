<?php
namespace App\Http\Controllers;

use App\Services\EstadoService;
use Illuminate\Http\JsonResponse;

class EstadoController extends Controller
{
    protected $estadoService;

    public function __construct(EstadoService $estadoService)
    {
        $this->estadoService = $estadoService;
    }

    public function index(): JsonResponse
    {
        try {
            $estados = $this->estadoService->obtenerTodos();
            return response()->json([
                'success' => true,
                'data' => $estados
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estados',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
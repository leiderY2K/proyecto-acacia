<?php
namespace App\Http\Controllers;

use App\Services\EstamentoService;
use Illuminate\Http\JsonResponse;

class EstamentoController extends Controller
{
    protected $estamentoService;

    public function __construct(EstamentoService $estamentoService)
    {
        $this->estamentoService = $estamentoService;
    }

    public function index(): JsonResponse
    {
        try {
            $estamentos = $this->estamentoService->obtenerTodos();
            return response()->json([
                'success' => true,
                'data' => $estamentos
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estamentos',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
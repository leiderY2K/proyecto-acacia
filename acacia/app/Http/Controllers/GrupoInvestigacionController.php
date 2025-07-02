<?php

namespace App\Http\Controllers;

use App\Services\GrupoInvestigacionService;
use Illuminate\Http\JsonResponse;

class GrupoInvestigacionController extends Controller
{
    protected $grupoInvestigacionService;
    public function __construct(GrupoInvestigacionService $grupoInvestigacionService)
    {
        $this->grupoInvestigacionService = $grupoInvestigacionService;
    }

    public function index(): JsonResponse
    {
        try {
            $grupos = $this->grupoInvestigacionService->obtenerTodos();
            return response()->json([
                'success' => true,
                'data' => $grupos
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener grupos de investigación',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
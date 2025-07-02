<?php

namespace App\Http\Controllers;

use App\Services\EstadisticasService;
use Illuminate\Http\JsonResponse;

class EstadisticasController extends Controller
{
    protected $estadisticasService;

    public function __construct(EstadisticasService $estadisticasService)
    {
        $this->estadisticasService = $estadisticasService;
    }

    public function totales(): JsonResponse
    {
        return response()->json($this->estadisticasService->totales());
    }

    public function investigadoresPorEstamento(): JsonResponse
    {
        return response()->json($this->estadisticasService->investigadoresPorEstamento());
    }

    public function investigadoresPorFacultad(): JsonResponse
    {
        return response()->json($this->estadisticasService->investigadoresPorFacultad());
    }

    public function investigadoresPorModulo(): JsonResponse
    {
        return response()->json($this->estadisticasService->investigadoresPorModulo());
    }

    public function proyectosPorTipo(): JsonResponse
    {
        return response()->json($this->estadisticasService->proyectosPorTipo());
    }

    public function proyectosPorEstado(): JsonResponse
    {
        return response()->json($this->estadisticasService->proyectosPorEstado());
    }

    public function proyectosPorAnioInicio(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->estadisticasService->proyectosPorAnioInicio()
        ]);
    }

    public function proyectosPorRangoInicio(): JsonResponse
    {
        $desde = request('desde');
        $hasta = request('hasta');

        if (!$desde || !$hasta) {
            return response()->json([
                'success' => false,
                'message' => 'Debe proporcionar los parámetros "desde" y "hasta".'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $this->estadisticasService->proyectosPorRangoInicio($desde, $hasta)
        ]);
    }

}

<?php

namespace App\Http\Controllers;

use App\Services\FacultadService;
use Illuminate\Http\JsonResponse;

class FacultadController extends Controller
{
    protected $facultadService;

    public function __construct(FacultadService $facultadService)
    {
        $this->facultadService = $facultadService;
    }

    public function index(): JsonResponse
    {
        try {
            $facultades = $this->facultadService->obtenerTodas();
            return response()->json([
                'success' => true,
                'data' => $facultades
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener facultades',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
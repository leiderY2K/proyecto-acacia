<?php

namespace App\Http\Controllers;

use App\Services\InvestigadorService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Exception;

class InvestigadorController extends Controller
{
    protected $investigadorService;

    public function __construct(InvestigadorService $investigadorService)
    {
        $this->investigadorService = $investigadorService;
    }

    public function index(): JsonResponse
    {
        try {
            $investigadores = $this->investigadorService->obtenerTodos();
            return response()->json([
                'success' => true,
                'data' => $investigadores
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener investigadores',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener un investigadores por gp de investigación y modulo
     */
    public function investigadoresGpModulo(): JsonResponse
    {
        try {
            $investigadores = $this->investigadorService->InvestigadoresGpModulo();
            return response()->json([
                'success' => true,
                'data' => $investigadores
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener investigadores por grupo de investigación y módulo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function show($id): JsonResponse
    {
        try {
            $investigador = $this->investigadorService->obtenerPorId($id);
            return response()->json([
                'success' => true,
                'data' => $investigador
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Investigador no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'nombre_completo' => 'required|string|max:200',
                'correo' => 'nullable|email|max:100',
                'telefono' => 'nullable|string|max:20',
                'observaciones' => 'nullable|string',
                'id_estamento' => 'required|string|max:3|exists:Estamento,id_estamento',
                'id_facultad' => 'required|string|exists:Facultad,id_facultad',
                'modulos' => 'nullable|array',
                'modulos.*' => 'string|exists:Modulo,id_modulo',
                'grupos' => 'nullable|array',
                'grupos.*' => 'string|exists:GrupoInvestigacion,id_grupo'
            ]);

            $investigador = $this->investigadorService->crear($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Investigador creado exitosamente',
                'data' => $investigador
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear investigador',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'nombre_completo' => 'sometimes|required|string|max:200',
                'correo' => 'nullable|email|max:100',
                'telefono' => 'nullable|string|max:20',
                'observaciones' => 'nullable|string',
                'id_estamento' => 'sometimes|required|string|max:3|exists:Estamento,id_estamento',
                'id_facultad' => 'required|string|exists:Facultad,id_facultad',
                'modulos' => 'nullable|array',
                'modulos.*' => 'string|exists:Modulo,id_modulo',
                'grupos' => 'nullable|array',
                'grupos.*' => 'string|exists:GrupoInvestigacion,id_grupo'
            ]);

            $investigador = $this->investigadorService->actualizar($id, $validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Investigador actualizado exitosamente',
                'data' => $investigador
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar investigador',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $this->investigadorService->eliminar($id);

            return response()->json([
                'success' => true,
                'message' => 'Investigador eliminado exitosamente'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar investigador',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
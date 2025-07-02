<?php

namespace App\Http\Controllers;

use App\Services\ProyectoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Exception;

class ProyectoController extends Controller
{
    protected $proyectoService;

    public function __construct(ProyectoService $proyectoService)
    {
        $this->proyectoService = $proyectoService;
    }

    /**
     * Obtener todos los proyectos
     */
    public function index(): JsonResponse
    {
        try {
            $proyectos = $this->proyectoService->obtenerTodos();
            return response()->json([
                'success' => true,
                'data' => $proyectos
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener proyectos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener un proyecto por modulo
     */
    public function proyectosPorModulo($idModulo): JsonResponse
    {
        try {
            $proyectos = $this->proyectoService->obtenerPorModulo($idModulo);

            return response()->json([
                'success' => true,
                'data' => $proyectos
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener proyectos por módulo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener un proyecto por ID
     */
    public function show($id): JsonResponse
    {
        try {
            $proyecto = $this->proyectoService->obtenerPorId($id);
            return response()->json([
                'success' => true,
                'data' => $proyecto
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Proyecto no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Crear un nuevo proyecto
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validar datos de entrada
            $validatedData = $request->validate([
                'nombre_proyecto' => 'required|string|max:300',
                'fecha_inicio' => 'required|integer|min:1900|max:2100',
                'fecha_finalizacion' => 'nullable|integer|min:1900|max:2100',
                'enlace' => 'nullable|string',
                'recursos_utilizados' => 'nullable|string',
                'anexo' => 'nullable|string',
                'id_tipo_proyecto' => 'required|string|exists:TipoProyecto,id_tipo_proyecto',
                'id_grupo' => 'required|string|exists:GrupoInvestigacion,id_grupo',
                'id_estado' => 'required|string|max:10|exists:Estado,id_estado',
                'investigadores' => 'nullable|array',
                'investigadores.*' => 'integer|exists:Investigador,id_investigador'
            ]);

            $proyecto = $this->proyectoService->crear($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Proyecto creado exitosamente',
                'data' => $proyecto
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
                'message' => 'Error al crear proyecto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un proyecto
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            // Validar datos de entrada
            $validatedData = $request->validate([
                'nombre_proyecto' => 'sometimes|required|string|max:300',
                'fecha_inicio' => 'sometimes|required|integer|min:1900|max:2100',
                'fecha_finalizacion' => 'nullable|integer|min:1900|max:2100',
                'enlace' => 'nullable|string',
                'recursos_utilizados' => 'nullable|string',
                'anexo' => 'nullable|string',
                'id_tipo_proyecto' => 'sometimes|required|string|exists:TipoProyecto,id_tipo_proyecto',
                'id_estado' => 'sometimes|required|string|max:10|exists:Estado,id_estado',
                'investigadores' => 'nullable|array',
                'investigadores.*' => 'integer|exists:Investigador,id_investigador'
            ]);

            $proyecto = $this->proyectoService->actualizar($id, $validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Proyecto actualizado exitosamente',
                'data' => $proyecto
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
                'message' => 'Error al actualizar proyecto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un proyecto
     */
    public function destroy($id): JsonResponse
    {
        try {
            $this->proyectoService->eliminar($id);

            return response()->json([
                'success' => true,
                'message' => 'Proyecto eliminado exitosamente'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar proyecto',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
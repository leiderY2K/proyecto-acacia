<?php

namespace App\Services;

use App\Models\Proyecto;
use Illuminate\Support\Facades\DB;
use Exception;

class ProyectoService
{
    public function obtenerTodos()
    {
        return Proyecto::with(['tipoProyecto', 'estado', 'investigadores'])->get();
    }

    public function obtenerPorId($id)
    {
        return Proyecto::with(['tipoProyecto', 'estado', 'investigadores'])
            ->findOrFail($id);
    }

    /**
     * Obtener proyectos por módulo
     */
    public function obtenerPorModulo($idModulo)
    {
        try {
            $proyectos = DB::table('Proyecto as p')
                ->join('InvestigadorProyecto as ip', 'p.id_proyecto', '=', 'ip.id_proyecto')
                ->join('Investigador as i', 'ip.id_investigador', '=', 'i.id_investigador')
                ->join('InvestigadorModulo as im', 'i.id_investigador', '=', 'im.id_investigador')
                ->where('im.id_modulo', $idModulo)
                ->select('p.id_proyecto')
                ->distinct()
                ->pluck('p.id_proyecto');

            $resultado = Proyecto::with(['tipoProyecto', 'estado', 'investigadores.modulos'])
                ->whereIn('id_proyecto', $proyectos)
                ->get();

            return response()->json([
                'success' => true,
                'proyectos' => $resultado
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener proyectos por módulo',
                'error' => $e->getMessage()
            ]);
        }
    }


    public function crear(array $datos)
    {
        DB::beginTransaction();

        try {
            // Crear el proyecto
            $proyecto = Proyecto::create([
                'nombre_proyecto' => $datos['nombre_proyecto'],
                'fecha_inicio' => $datos['fecha_inicio'],
                'fecha_finalizacion' => $datos['fecha_finalizacion'] ?? null,
                'enlace' => $datos['enlace'] ?? null,
                'recursos_utilizados' => $datos['recursos_utilizados'] ?? null,
                'anexo' => $datos['anexo'] ?? null,
                'id_tipo_proyecto' => $datos['id_tipo_proyecto'],
                'id_estado' => $datos['id_estado']
            ]);

            // Asociar investigadores si se proporcionan
            if (isset($datos['investigadores']) && is_array($datos['investigadores'])) {
                $proyecto->investigadores()->attach($datos['investigadores']);
            }

            DB::commit();

            // Retornar el proyecto con sus relaciones
            return $proyecto->load(['tipoProyecto', 'estado', 'investigadores']);

        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    public function actualizar($id, array $datos)
    {
        DB::beginTransaction();

        try {
            $proyecto = Proyecto::findOrFail($id);

            // Actualizar datos básicos del proyecto
            $proyecto->update([
                'nombre_proyecto' => $datos['nombre_proyecto'] ?? $proyecto->nombre_proyecto,
                'fecha_inicio' => $datos['fecha_inicio'] ?? $proyecto->fecha_inicio,
                'fecha_finalizacion' => $datos['fecha_finalizacion'] ?? $proyecto->fecha_finalizacion,
                'enlace' => $datos['enlace'] ?? $proyecto->enlace,
                'recursos_utilizados' => $datos['recursos_utilizados'] ?? $proyecto->recursos_utilizados,
                'anexo' => $datos['anexo'] ?? $proyecto->anexo,
                'id_tipo_proyecto' => $datos['id_tipo_proyecto'] ?? $proyecto->id_tipo_proyecto,
                'id_estado' => $datos['id_estado'] ?? $proyecto->id_estado
            ]);

            // Actualizar investigadores si se proporcionan
            if (isset($datos['investigadores']) && is_array($datos['investigadores'])) {
                $proyecto->investigadores()->sync($datos['investigadores']);
            }

            DB::commit();

            return $proyecto->load(['tipoProyecto', 'estado', 'investigadores']);

        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    public function eliminar($id)
    {
        DB::beginTransaction();

        try {
            $proyecto = Proyecto::findOrFail($id);

            // Eliminar relaciones
            $proyecto->investigadores()->detach();

            // Eliminar proyecto
            $proyecto->delete();

            DB::commit();

            return true;

        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }
    }
}

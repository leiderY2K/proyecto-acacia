<?php
namespace App\Services;

use App\Models\Investigador;
use Illuminate\Support\Facades\DB;
use Exception;

class InvestigadorService
{
    public function obtenerTodos()
    {
        return Investigador::with(['estamento', 'facultad', 'grupos', 'proyectos'])->get();
    }

    public function obtenerPorId($id)
    {
        return Investigador::with(['estamento', 'facultad', 'grupos', 'proyectos'])
            ->findOrFail($id);
    }

    /**
     * Obtener investigadores por gp de investigación y modulo
     */

    public function InvestigadoresGpModulo()
    {
        return DB::table('Investigador as i')
            ->select(
                'i.nombre_completo as investigador',
                'e.nombre_estamento as estamento',
                'g.nombre_grupo as grupo_investigacion',
                'm.nombre_modulo as modulo'
            )
            ->join('Estamento as e', 'i.id_estamento', '=', 'e.id_estamento')
            ->leftJoin('InvestigadorGrupoInvestigacion as igi', 'i.id_investigador', '=', 'igi.id_investigador')
            ->leftJoin('GrupoInvestigacion as g', 'igi.id_grupo', '=', 'g.id_grupo')
            ->leftJoin('InvestigadorModulo as im', 'i.id_investigador', '=', 'im.id_investigador')
            ->leftJoin('Modulo as m', 'im.id_modulo', '=', 'm.id_modulo')
            ->orderBy('i.nombre_completo')
            ->get();
    }

    public function crear(array $data)
    {
        try {
            // Extraer los módulos si vienen
            $modulos = $data['modulos'] ?? [];

            // Eliminar 'modulos' del array para evitar que Laravel intente insertarlos como columna
            unset($data['modulos']);

            // Crear el investigador
            $investigador = Investigador::create($data);

            // Asociar los módulos
            if (!empty($modulos)) {
                $investigador->modulos()->sync($modulos);
            }

            // Relacionar grupos si hay
            if (!empty($data['grupos'])) {
                $investigador->grupos()->attach($data['grupos']);
            }

            // Retornar con la relación cargada
            return $investigador->load(['modulos', 'estamento', 'facultad', 'grupos', 'proyectos']);
        } catch (Exception $e) {
            throw new Exception("Error al crear el investigador y sus módulos: " . $e->getMessage());
        }
    }

    public function actualizar($id, array $data)
    {
        $investigador = Investigador::findOrFail($id);
        $investigador->update($data);
        return $investigador;
    }

    public function eliminar($id)
    {
        return Investigador::destroy($id);
    }
}

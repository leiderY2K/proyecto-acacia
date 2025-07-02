<?php

namespace App\Services;

use App\Models\Investigador;
use App\Models\Proyecto;
use App\Models\Modulo;
use App\Models\Facultad;
use App\Models\Estamento;
use App\Models\TipoProyecto;
use App\Models\Estado;
use Illuminate\Support\Facades\DB;

class EstadisticasService
{
    public function totales()
    {
        return [
            'total_investigadores' => Investigador::count(),
            'total_proyectos' => Proyecto::count(),
            'total_modulos' => Modulo::count(),
            'total_facultades' => Facultad::count(),
            'total_estamentos' => Estamento::count(),
            'total_tipos_proyecto' => TipoProyecto::count()
        ];
    }

    public function investigadoresPorEstamento()
    {
        return Investigador::join('Estamento', 'Investigador.id_estamento', '=', 'Estamento.id_estamento')
            ->select('Estamento.nombre_estamento as nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('Estamento.nombre_estamento')
            ->get();

    }

    public function investigadoresPorFacultad()
    {
        return Investigador::join('Facultad', 'Investigador.id_facultad', '=', 'Facultad.id_facultad')
            ->select('Facultad.nombre_facultad as nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('Facultad.nombre_facultad')
            ->get();

    }

    public function investigadoresPorModulo()
    {
        return Modulo::withCount('investigadores')
            ->get(['id_modulo', 'nombre_modulo']);
    }

    public function proyectosPorTipo()
    {
        return Proyecto::join('TipoProyecto', 'Proyecto.id_tipo_proyecto', '=', 'TipoProyecto.id_tipo_proyecto')
            ->select('TipoProyecto.nombre_tipo_proyecto as nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('TipoProyecto.nombre_tipo_proyecto')
            ->get();
    }

    public function proyectosPorEstado()
    {
        return Proyecto::join('Estado', 'Proyecto.id_estado', '=', 'Estado.id_estado')
            ->select('Estado.nombre_estado as nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('Estado.nombre_estado')
            ->get();

    }
    public function proyectosPorAnioInicio()
    {
        return Proyecto::select('fecha_inicio as anio', DB::raw('COUNT(*) as total'))
            ->groupBy('fecha_inicio')
            ->orderBy('fecha_inicio')
            ->get();
    }

    public function proyectosPorRangoInicio($desde, $hasta)
    {
        return Proyecto::select('fecha_inicio', DB::raw('COUNT(*) as total'))
            ->whereBetween('fecha_inicio', [$desde, $hasta])
            ->groupBy('fecha_inicio')
            ->orderBy('fecha_inicio')
            ->get();
    }
}
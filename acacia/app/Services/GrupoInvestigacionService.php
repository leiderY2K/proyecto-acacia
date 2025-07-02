<?php

namespace App\Services;

use App\Models\GrupoInvestigacion;

class GrupoInvestigacionService
{
    public function obtenerTodos()
    {
        return GrupoInvestigacion::all();
    }
}

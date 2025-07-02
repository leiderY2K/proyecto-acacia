<?php

namespace App\Services;

use App\Models\TipoProyecto;

class TipoProyectoService
{
    public function obtenerTodos()
    {
        return TipoProyecto::all();
    }
}

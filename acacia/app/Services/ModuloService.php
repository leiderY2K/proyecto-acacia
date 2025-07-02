<?php

namespace App\Services;

use App\Models\Modulo;

class ModuloService
{
    public function obtenerTodos()
    {
        return Modulo::all();
    }
}

<?php

namespace App\Services;

use App\Models\Estado;

class EstadoService
{
    public function obtenerTodos()
    {
        return Estado::all();
    }
}

<?php

namespace App\Services;

use App\Models\Estamento;

class EstamentoService
{
    public function obtenerTodos()
    {
        return Estamento::all();
    }
}

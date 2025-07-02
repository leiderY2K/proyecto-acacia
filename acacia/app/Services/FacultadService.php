<?php

namespace App\Services;

use App\Models\Facultad;

class FacultadService
{
    public function obtenerTodas()
    {
        return Facultad::all();
    }
}

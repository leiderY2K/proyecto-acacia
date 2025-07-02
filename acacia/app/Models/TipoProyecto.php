<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoProyecto extends Model
{
    use HasFactory;

    protected $table = 'TipoProyecto';
    protected $primaryKey = 'id_tipo_proyecto';
    public $incrementing = false; // Porque es VARCHAR
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id_tipo_proyecto',
        'nombre_tipo_proyecto'
    ];

    // Relación con proyectos
    public function proyectos()
    {
        return $this->hasMany(Proyecto::class, 'id_tipo_proyecto');
    }
}
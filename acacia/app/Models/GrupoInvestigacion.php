<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrupoInvestigacion extends Model
{
    use HasFactory;

    protected $table = 'GrupoInvestigacion';
    public $incrementing = false; 
    protected $primaryKey = 'id_grupo';
    public $timestamps = false;

    protected $fillable = [
        'id_grupo',
        'nombre_grupo',
    ];

    /**
     * Relación: Un Grupo de Investigación puede tener muchos Investigadores.
     */
    public function investigadores()
    {
        return $this->belongsToMany(Investigador::class, 'InvestigadorGrupoInvestigacion', 'id_grupo', 'id_investigador');
    }
}
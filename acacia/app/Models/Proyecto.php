<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proyecto extends Model
{
    use HasFactory;
    
    protected $table = 'Proyecto';
    protected $primaryKey = 'id_proyecto';
    
    protected $fillable = [
        'nombre_proyecto',
        'fecha_inicio',
        'fecha_finalizacion',
        'enlace',
        'recursos_utilizados',
        'anexo',
        'id_tipo_proyecto',
        'id_estado'
    ];
    
    public $timestamps = false;
    
    // Relaciones
    public function tipoProyecto()
    {
        return $this->belongsTo(TipoProyecto::class, 'id_tipo_proyecto');
    }
    
    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado');
    }
    
    // Relación muchos a muchos con investigadores
    public function investigadores()
    {
        return $this->belongsToMany(
            Investigador::class, 
            'InvestigadorProyecto', 
            'id_proyecto', 
            'id_investigador'
        );
    }
}
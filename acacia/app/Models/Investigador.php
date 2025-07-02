<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investigador extends Model
{
    use HasFactory;

    protected $table = 'Investigador';
    protected $primaryKey = 'id_investigador';
    public $timestamps = false;
    
    protected $fillable = [
        'nombre_completo',
        'correo',
        'telefono',
        'observaciones',
        'id_estamento',
        'id_facultad'
    ];
    public function estamento() {
        return $this->belongsTo(
            Estamento::class, 
            'id_estamento'
        );
    }

    public function facultad() {
        return $this->belongsTo(
            Facultad::class, 
            'id_facultad'
        );
    }

    public function grupos() {
        return $this->belongsToMany(
            GrupoInvestigacion::class, 
            'InvestigadorGrupoInvestigacion', 
            'id_investigador', 
            'id_grupo'
        );
    }

    public function proyectos() {
        return $this->belongsToMany(Proyecto::class, 'InvestigadorProyecto', 'id_investigador', 'id_proyecto');
    }

    // Relación muchos a muchos con módulos
    public function modulos()
    {
        return $this->belongsToMany(
            Modulo::class, 
            'InvestigadorModulo', 
            'id_investigador',
            'id_modulo'
        );
    }

}


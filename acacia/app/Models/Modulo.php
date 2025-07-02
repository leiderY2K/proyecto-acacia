<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modulo extends Model
{
    use HasFactory;

    protected $table = 'Modulo';
    protected $primaryKey = 'id_modulo';
    public $incrementing = false; // Porque es VARCHAR
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id_modulo',
        'nombre_modulo'
    ];

    // Relación inversa con Investigador
    public function investigadores()
    {
        return $this->belongsToMany(
            Investigador::class,
            'InvestigadorModulo',
            'id_modulo',
            'id_investigador'
        );
    }
}

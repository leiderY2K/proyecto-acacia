<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

Class Estamento extends Model
{
    use HasFactory;

    protected $table = 'Estamento';
    protected $primaryKey = 'id_estamento';
    public $incrementing = false; // Porque es VARCHAR
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id_estamento',
        'nombre_estamento'
    ];

    // Relación con proyectos
    public function proyectos()
    {
        return $this->hasMany(Proyecto::class, 'id_estamento');
    }   
}
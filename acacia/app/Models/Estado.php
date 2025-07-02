<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    use HasFactory;
    
    protected $table = 'Estado';
    protected $primaryKey = 'id_estado';
    public $incrementing = false; // Porque es VARCHAR
    protected $keyType = 'string';
    public $timestamps = false;
    
    protected $fillable = [
        'id_estado',
        'nombre_estado'
    ];
    
    // Relación con proyectos
    public function proyectos()
    {
        return $this->hasMany(Proyecto::class, 'id_estado');
    }
}
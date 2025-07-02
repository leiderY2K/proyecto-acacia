<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facultad extends Model
{
    use HasFactory;

    protected $table = 'Facultad';
    protected $primaryKey = 'id_facultad';
    public $incrementing = false; // Porque es VARCHAR
    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id_facultad',
        'nombre_facultad'
    ];
}

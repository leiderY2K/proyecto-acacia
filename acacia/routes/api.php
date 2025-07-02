<?php

use App\Http\Controllers\ModuloController;
use App\Http\Controllers\TipoProyectoController;
use App\Http\Controllers\EstadoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProyectoController;
use App\Http\Controllers\InvestigadorController;
use App\Http\Controllers\FacultadController;
use App\Http\Controllers\EstamentoController;
use App\Http\Controllers\GrupoInvestigacionController;
use App\Http\Controllers\EstadisticasController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rutas para el CRUD de proyectos
Route::get('/proyectos', [ProyectoController::class, 'index']);                                     // GET /api/proyectos
Route::get('/proyectos/{id}', [ProyectoController::class, 'show']);                                 // GET /api/proyectos/{id}
Route::get('/proyectos/modulo/{idModulo}', [ProyectoController::class, 'proyectosPorModulo']);      // GET /api/proyectos/modulo/{idModulo}
Route::post('/proyectos', [ProyectoController::class, 'store']);                                    // POST /api/proyectos
Route::put('/proyectos/{id}', [ProyectoController::class, 'update']);                               // PUT /api/proyectos/{id}
Route::delete('/proyectos/{id}', [ProyectoController::class, 'destroy']);                           // DELETE /api/proyectos/{id}


// Rutas para el CRUD de Invectigadores

Route::get('/investigadores', [InvestigadorController::class, 'index']);                            // GET /api/investigadores
Route::post('/investigadores', [InvestigadorController::class, 'store']);                           // GET /api/investigadores
Route::get('/investigadores/gp-modulo', [InvestigadorController::class, 'investigadoresGpModulo']); // GET /api/investigadores/gp-modulo
Route::get('/investigadores/{id}', [InvestigadorController::class, 'show']);                        // POST /api/investigadores
Route::put('/investigadores/{id}', [InvestigadorController::class, 'update']);                      // PUT /api/investigadores/{id}
Route::delete('/investigadores/{id}', [InvestigadorController::class, 'destroy']);                  // DELETE /api/investigador/{id}


// Rutas protegidas para el CRUD de facultades y estamentos
//Route::middleware('auth:sanctum')->group(function () {
Route::get('/facultades', [FacultadController::class, 'index'])->middleware('can:admin-only');
Route::get('/estamentos', [EstamentoController::class, 'index'])->middleware('can:admin-only');
//});

// Rutas para el CRUD de facultades
Route::get('/facultades', [FacultadController::class, 'index']);

// Rutas para el CRUD de estamentos
Route::get('/estamentos', [EstamentoController::class, 'index']);

//Rutas para el CRUD de modulos
Route::get('/modulos', [ModuloController::class, 'index']);

//Rutas para el CRUD de grupos de investigación
Route::get('/grupos', [GrupoInvestigacionController::class, 'index']);

// Rutas para el CRUD de tipos de proyectos
Route::get('/tipos-proyecto', [TipoProyectoController::class, 'index']);

// Rutas para el CRUD de estados
Route::get('/estados', [EstadoController::class, 'index']);

// Rutas para las estadísticas
Route::prefix('/estadisticas')->group(function () {
    Route::get('/totales', [EstadisticasController::class, 'totales']);
    Route::get('/investigadores-por-estamento', [EstadisticasController::class, 'investigadoresPorEstamento']);
    Route::get('/investigadores-por-facultad', [EstadisticasController::class, 'investigadoresPorFacultad']);
    Route::get('/investigadores-por-modulo', [EstadisticasController::class, 'investigadoresPorModulo']);
    Route::get('/proyectos-por-tipo', [EstadisticasController::class, 'proyectosPorTipo']);
    Route::get('/proyectos-por-estado', [EstadisticasController::class, 'proyectosPorEstado']);
    Route::get('/proyectos-por-anio-inicio', [EstadisticasController::class, 'proyectosPorAnioInicio']);
    Route::get('/proyectos-por-rango-inicio', [EstadisticasController::class, 'proyectosPorRangoInicio']);
});
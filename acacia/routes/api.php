<?php

use App\Http\Controllers\{
    AuthController,
    ModuloController,
    TipoProyectoController,
    EstadoController,
    ProyectoController,
    InvestigadorController,
    FacultadController,
    EstamentoController,
    GrupoInvestigacionController,
    EstadisticasController
};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Ruta para obtener usuario autenticado (mantener la tuya original)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// === RUTAS DE AUTENTICACIÓN ===
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware(['web', 'auth']);

// === RUTAS PÚBLICAS ===
// Rutas para el CRUD de proyectos (públicas)
Route::get('/proyectos', [ProyectoController::class, 'index']);
Route::get('/proyectos/{id}', [ProyectoController::class, 'show']);
Route::get('/proyectos/modulo/{idModulo}', [ProyectoController::class, 'proyectosPorModulo']);

// Rutas para investigadores (públicas)
Route::get('/investigadores', [InvestigadorController::class, 'index']);
Route::get('/investigadores/gp-modulo', [InvestigadorController::class, 'investigadoresGpModulo']);
Route::get('/investigadores/{id}', [InvestigadorController::class, 'show']);

// Rutas para catálogos (públicas)
Route::get('/facultades', [FacultadController::class, 'index']);
Route::get('/estamentos', [EstamentoController::class, 'index']);
Route::get('/modulos', [ModuloController::class, 'index']);
Route::get('/grupos', [GrupoInvestigacionController::class, 'index']);
Route::get('/tipos-proyecto', [TipoProyectoController::class, 'index']);
Route::get('/estados', [EstadoController::class, 'index']);

// Rutas para las estadísticas (públicas)
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

// === RUTAS PROTEGIDAS (requieren autenticación) ===
Route::middleware(['auth:sanctum'])->group(function () {
    // CRUD de proyectos (operaciones que modifican datos)
    Route::post('/proyectos', [ProyectoController::class, 'store']);
    Route::put('/proyectos/{id}', [ProyectoController::class, 'update']);
    Route::delete('/proyectos/{id}', [ProyectoController::class, 'destroy']);
    
    // CRUD de investigadores (operaciones que modifican datos)
    Route::post('/investigadores', [InvestigadorController::class, 'store']);
    Route::put('/investigadores/{id}', [InvestigadorController::class, 'update']);
    Route::delete('/investigadores/{id}', [InvestigadorController::class, 'destroy']);

    // Logout también debería protegerse con el token
    Route::post('/logout', [AuthController::class, 'logout']);
});

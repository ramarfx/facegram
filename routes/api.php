<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FollowerController;
use App\Http\Controllers\FollowingController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::apiResource('/posts', PostController::class);

    // following
    Route::get('/users/{username}/following', [FollowingController::class, 'index']);
    Route::post('/users/{username}/follow', [FollowingController::class, 'store']);
    Route::delete('/users/{username}/unfollow', [FollowingController::class, 'destroy']);

    // follower
    Route::get('/users/{username}/followers', [FollowerController::class, 'index']);
    Route::put('/users/{username}/accept', [FollowerController::class, 'update']);

    // users
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{username}', [UserController::class, 'show']);
});

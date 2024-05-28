<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowerController extends Controller
{
    public function index(string $username){
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $followers = Follow::where('following_id', $user->id)->get();
        $users = [];

        foreach ($followers as $follwers) {
            $users[] = User::find($follwers->follower_id);
        }

        return response()->json(['followers' => $users]);
    }

    public function update(string $username){
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $follower = Follow::where('follower_id', $user->id)->where('following_id', Auth::id())->first();

        if (!$follower) {
            return response()->json(['message' => 'the user is not following you'], 422);
        }

        if ($follower->is_accepted) {
            return response()->json(['message' => "Follow request is already accepted"], 422);
        }

        $follower->is_accepted = true;
        $follower->save();

        return response()->json(['message' =>  "Follow request accepted"]);
    }

    public function destroy(string $username){
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $followed = Follow::where('follower_id', Auth::id())->where('following_id', $user->id)->first();

        if (!$followed) {
            return response()->json(['message' => 'You are not following the user'], 422);
        }

        $followed->delete();

        return response()->json(['message' => 'unfollow success']);
    }
}

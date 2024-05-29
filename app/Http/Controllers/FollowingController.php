<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowingController extends Controller
{
    public function index(string $username){
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $followings = Follow::where('follower_id', $user->id)->get();
        $users = [];

        foreach ($followings as $following) {
            $users[] = User::find($following->following_id);
        }

        return response()->json(['followings' => $users]);
    }

    public function store(Request $request, string $username){
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->id === auth()->user()->id) {
            return response()->json(['message' => 'you are not allowed to follow yourself'], 422);
        }

        $followed = Follow::where('follower_id', Auth::id())->where('following_id', $user->id)->first();

        if ($followed) {
            $status = $followed->is_accepted == 1 ? 'accepted' : 'requested';
            return response()->json(['message' => 'You are already followed', 'status' => $status], 422);
        }

        if ($user->is_private) {
            $follow = Follow::create([
                'follower_id' => Auth::id(),
                'following_id' => $user->id,

            ]);
        } else {
            $follow = Follow::create([
                'follower_id' => Auth::id(),
                'following_id' => $user->id,
                'is_accepted' => 1
            ]);
        }

        $status = $follow->is_accepted == 1 ? 'following' : 'requested';

        return response()->json(['message' => "Follow success", 'status' => $status]);
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

<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Http\Request;
use App\Models\PostAttachment;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $users = User::whereNot('id', Auth::id())->get();

        return response()->json(['users' => $users]);
    }

    public function show(string $username)
    {
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json(['message' => 'user not found'], 404);
        }

        $isYourAccount = $user->id == Auth::id();
        $following = Follow::where('follower_id', Auth::id())->where('following_id', $user->id)->first();

        if ($following) {
            if ($following->is_accepted) {
                $followingStatus = 'following';
            } else {
                $followingStatus = 'requested';
            }
        } else {
            $followingStatus = 'not-following';
        }

        if (!$isYourAccount) {
            if (!$user->is_private || $followingStatus == 'following') {
                $posts = Post::where('user_id', $user->id)->get()->map(function ($post) {
                    $attacments = PostAttachment::where('post_id', $post->id)->get();
                    return [
                        'id' => $post->id,
                        'caption' => $post->caption,
                        'created_at' => $post->created_at,
                        'deleted_at' => $post->deleted_at,
                        'attachments' => $attacments->map(function ($attachment) {
                            return [
                                'id' => $attachment->id,
                                'storage_path' => $attachment->storage_path
                            ];
                        })
                    ];
                });

            } else {
                $posts = [];
            }
        } else {
            if ($user->is_private) {
                $posts = [];
            } else {
                $posts = Post::where('user_id', $user->id)->get()->map(function ($post) {
                    $attacments = PostAttachment::where('post_id', $post->id)->get();
                    return [
                        'id' => $post->id,
                        'caption' => $post->caption,
                        'created_at' => $post->created_at,
                        'deleted_at' => $post->deleted_at,
                        'attachments' => $attacments->map(function ($attachment) {
                            return [
                                'id' => $attachment->id,
                                'storage_path' => $attachment->storage_path
                            ];
                        })
                    ];
                });
            }
        }

        return response()->json([
            'id' => $user->id,
            'full_name' => $user->full_name,
            'username' => $user->username,
            'bio' => $user->bio,
            'is_private' => $user->is_private,
            'created_at' => $user->created_at,
            'is_your_account' => $isYourAccount,
            'following_status' => $followingStatus,
            'post_count' => Post::where('user_id', $user->id)->count(),
            'followers_count' => Follow::where('following_id', $user->id)->count(),
            'following_count' => Follow::where('follower_id', $user->id)->count(),
            'posts' => $posts
        ]);
    }
}

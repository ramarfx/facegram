<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostAttachment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'page' => 'integer|min:0',
            'size' => 'integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid field', 'errors' => $validator->errors()], 422);
        }

        $page = $request->input('page', 0);
        $size = $request->input('size', 10);

        $posts = Post::paginate($size, ['*'], 'page', $page + 1);

        return response()->json([
            'page' => $page,
            'size' => $size,
            'posts' => $posts->map(function ($post) {
                $attacments = PostAttachment::where('post_id', $post->id)->get();
                return [
                    'id' => $post->id,
                    'caption' => $post->caption,
                    'created_at' => $post->created_at,
                    'deleted_at' => $post->deleted_at,
                    'user' => User::find($post->user_id),
                    'attachments' => $attacments->map(function($attachment){
                        return [
                            'id' => $attachment->id,
                            'storage_path' => $attachment->storage_path
                        ];
                    })
                ];
            })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'caption' => 'required',
            'attachments.*' => 'required|file|mimes:png,jpg,jpeg,gif,webp'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid field', 'errors' => $validator->errors()], 422);
        }

        $post = Post::create([
            'caption' => $request->caption,
            'user_id' => Auth::id()
        ]);

        foreach ($request->attachments as $attachment){
            $image = $attachment->store('posts');

            PostAttachment::create([
                'storage_path' => $image,
                'post_id' => $post->id
            ]);
        }

        return response()->json(['message' => 'create post success']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $post = Post::find($id);

        if(!$post){
            return response()->json(['message' => 'post not found'], 404);
        }

        if ($post->user_id != Auth::id()) {
            return response()->json(['message' => 'forbidden access'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'delete post success']);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index()
    {
        // Tüm gönderileri kullanıcı bilgileriyle birlikte çekiyoruz
        $posts = Post::with('user')->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
        ]);
    }

    public function create()
    {
        return Inertia::render('Posts/Create');
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // Günlük limit kontrolü
        $todayPostsCount = $user->posts()->whereDate('created_at', Carbon::today())->count();
        if ($todayPostsCount >= 3) {
            return back()->withErrors(['message' => 'Bugün en fazla 3 blog oluşturabilirsiniz.']);
        }

        $request->validate([
            'title' => 'required|max:255',
            'content' => 'required',
        ]);

        // Benzersiz slug oluşturma
        $slug = Str::slug($request->title);
        $originalSlug = $slug;
        $counter = 1;
        while (Post::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        $user->posts()->create([
            'title' => $request->title,
            'content' => $request->content,
            'slug' => $slug,
        ]);

        // Önbelleği temizle
        Cache::flush();

        return redirect()->route('posts.index');
    }

    public function show($slug)
    {
        $post = Cache::remember('post_' . $slug, 60, function () use ($slug) {
            return Post::where('slug', $slug)->with('user')->firstOrFail();
        });

        if (!$post) {
            return redirect()->route('posts.index')->with('error', 'Gönderi bulunamadı.');
        }

        return Inertia::render('Posts/Show', ['post' => $post]);
    }

    public function myBlogs()
    {
        $posts = Post::where('user_id', Auth::user()->id)->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Posts/MyBlogs', ['posts' => $posts]);
    }
}
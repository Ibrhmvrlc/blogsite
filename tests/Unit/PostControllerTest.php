<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_displays_the_blog_list_page()
    {
        Post::factory(25)->create();

        $response = $this->get(route('posts.index'));

        $response->assertStatus(200);
        $response->assertSee('Tüm Bloglar');
        $this->assertCount(20, $response->viewData('posts')->items());
    }

    /** @test */
    public function only_authenticated_users_can_access_create_page()
    {
        $response = $this->get(route('posts.create'));

        $response->assertRedirect(route('login'));

        $user = User::factory()->create();
        $response = $this->actingAs($user)->get(route('posts.create'));

        $response->assertStatus(200);
    }

    /** @test */
    public function it_allows_users_to_create_blog_if_daily_limit_not_reached()
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('posts.store'), [
            'title' => 'Test Blog',
            'content' => 'Test content',
        ]);

        $this->assertDatabaseHas('posts', [
            'title' => 'Test Blog',
            'content' => 'Test content',
            'user_id' => $user->id,
        ]);
    }

    /** @test */
    public function it_does_not_allow_more_than_three_blogs_per_day()
    {
        $user = User::factory()->create();

        for ($i = 1; $i <= 3; $i++) {
            $this->actingAs($user)->post(route('posts.store'), [
                'title' => 'Test Blog ' . $i,
                'content' => 'Test content ' . $i,
            ]);
        }

        $response = $this->actingAs($user)->post(route('posts.store'), [
            'title' => 'Test Blog 4',
            'content' => 'Test content 4',
        ]);

        $response->assertSessionHasErrors(['message']);
    }

    /** @test */
    public function it_creates_unique_slug_for_each_blog()
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('posts.store'), [
            'title' => 'Unique Title',
            'content' => 'Some content',
        ]);

        $this->actingAs($user)->post(route('posts.store'), [
            'title' => 'Unique Title',
            'content' => 'Another content',
        ]);

        $this->assertDatabaseHas('posts', ['slug' => 'unique-title']);
        $this->assertDatabaseHas('posts', ['slug' => 'unique-title-1']);
    }

    /** @test */
    public function it_displays_a_blog_post()
    {
        $post = Post::factory()->create(['title' => 'Test Blog']);

        $response = $this->get(route('posts.show', $post->slug));

        $response->assertStatus(200);
        $response->assertSee($post->title);
        $response->assertSee($post->content);
    }

    /** @test */
    public function it_caches_the_blog_post()
    {
        $post = Post::factory()->create(['slug' => 'cached-slug']);

        $this->get(route('posts.show', 'cached-slug'));
        $cachedPost = Cache::get('post_cached-slug');

        $this->assertNotNull($cachedPost);
        $this->assertEquals($post->id, $cachedPost->id);
    }

    /** @test */
    public function it_displays_users_own_blogs()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $userPosts = Post::factory(2)->create(['user_id' => $user->id]);
        $otherPosts = Post::factory(2)->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->get(route('posts.myBlogs'));

        $response->assertStatus(200);
        foreach ($userPosts as $post) {
            $response->assertSee($post->title);
        }

        foreach ($otherPosts as $post) {
            $response->assertDontSee($post->title);
        }
    }
}

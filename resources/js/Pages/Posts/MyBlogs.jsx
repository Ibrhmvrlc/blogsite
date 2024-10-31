import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';

export default function MyBlogs({ posts, auth }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('tr-TR', {
            dateStyle: 'full',
            timeStyle: 'short'
        }).format(date);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Bloglarım
                </h2>
            }
            auth={auth}
        >
            <Head title="Bloglarım" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {posts.data.map((post) => (
                                <div key={post.id} className="mb-4">
                                    <h2 className="text-lg font-semibold">
                                        <Link href={`/posts/${post.slug}`} className="text-blue-500 hover:underline">
                                            {post.title}
                                        </Link>
                                    </h2>
                                    <p>{formatDate(post.created_at)}</p>
                                </div>
                            ))}
                            <div className="mt-6">
                                {posts.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 border rounded ${link.active ? 'bg-blue-500 text-white' : 'text-blue-500 border-blue-500'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
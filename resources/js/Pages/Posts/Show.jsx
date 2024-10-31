import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Show({ post }) {
    if (!post) return <Layout><p>Gönderi bulunamadı.</p></Layout>;

    return (
        <AuthenticatedLayout
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                {post.user?.name} Blog yazısı - {post.title}
            </h2>
        }
        >
            <Head title={post.title || 'Gönderi'} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                            <p className="text-gray-600 mb-4">Yazar: {post.user?.name}</p>
                            <div className="text-gray-800 leading-relaxed">
                                {post.content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        </AuthenticatedLayout>
    );
}
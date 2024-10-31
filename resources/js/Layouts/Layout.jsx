import React from 'react';
import { Link, Head } from '@inertiajs/react';

export default function Layout({ children, auth }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Blog Dashboard" />
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Blog Sitesi Çalışması</h1>
                    <nav className="space-x-4">
                        <Link href="/" className="text-gray-500 hover:text-gray-700">Tüm Bloglar</Link>
                        
                        {auth.user ? (
                            <>
                                <Link href="/my-blogs" className="text-gray-500 hover:text-gray-700">Bloglarım</Link>
                                <Link href="/posts/create" className="text-gray-500 hover:text-gray-700">Blog Yaz</Link>
                                <Link href="/logout" method="post" as="button" className="text-gray-500 hover:text-gray-700">Çıkış</Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-500 hover:text-gray-700">Giriş Yap</Link>
                                <Link href="/register" className="text-gray-500 hover:text-gray-700">Kayıt Ol</Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
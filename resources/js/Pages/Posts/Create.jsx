import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Create() {
    const { auth } = usePage().props; // auth propunu almak için
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post('/posts', {
            onSuccess: () => reset(), // Başarılı olduğunda formu temizle
            onError: () => console.log("Gönderim sırasında hata oluştu."), // Hata oluşursa mesaj göster
        });
    };

    return (
        <AuthenticatedLayout
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                Blog Yaz
            </h2>
        }
        auth={auth}>
            <Head title="Blog Yaz" />



            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block font-medium text-sm text-gray-700">Başlık</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                    {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                                </div>
                                <div className="mb-4">
                                    <label className="block font-medium text-sm text-gray-700">İçerik</label>
                                    <textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    ></textarea>
                                    {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
                                </div>
                                <button type="submit" disabled={processing} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Oluştur
                                </button>
                                {errors.message && <div className="text-red-500 text-sm mt-2">{errors.message}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
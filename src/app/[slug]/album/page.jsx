import { Suspense } from 'react';
import WeddingAlbumManager from './wedding-album-manager';

function LoadingAlbum() {
    return (
        <main className="min-h-screen bg-[#f8f6f0] px-5 py-12 text-[#244b4c]">
            <div className="mx-auto max-w-6xl animate-pulse">
                <div className="h-20 rounded-2xl border border-[#d7ddd1] bg-white" />
                <div className="mt-8 h-40 rounded-[2rem] bg-[#e8eee7]" />
            </div>
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<LoadingAlbum />}>
            <WeddingAlbumManager />
        </Suspense>
    );
}

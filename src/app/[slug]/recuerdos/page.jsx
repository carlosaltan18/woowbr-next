import { Suspense } from 'react';
import WeddingMemoriesUploader from './wedding-memories-uploader';

function LoadingMemories() {
    return (
        <main className="min-h-screen bg-[#f8f6f0] px-5 py-12 text-[#244b4c]">
            <div className="mx-auto max-w-2xl animate-pulse rounded-[2rem] border border-[#d7ddd1] bg-white p-8 sm:p-12">
                <div className="h-3 w-24 rounded bg-[#d7ddd1]" />
                <div className="mt-6 h-12 max-w-sm rounded bg-[#e8ebe3]" />
                <div className="mt-4 h-5 max-w-md rounded bg-[#e8ebe3]" />
            </div>
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<LoadingMemories />}>
            <WeddingMemoriesUploader />
        </Suspense>
    );
}

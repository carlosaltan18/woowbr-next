import { redirect } from 'next/navigation';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
        else if (typeof value === 'string') query.set(key, value);
    });

    redirect(`/Juanpa&Luchi-weeding${query.size ? `?${query.toString()}` : ''}#rsvp`);
}

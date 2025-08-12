import {ItemList} from "@/components/ItemList";

export default function Home() {
    return (
        <main className='min-h-screen flex justify-center p-4'>
            <div className='bg-sky-900 p-6 rounded shadow w-full max-w-8xl'>
                <h1 className='text-3xl font-bold mb-6 text-center'>Grounded Chopping List</h1>
                <ItemList/>
            </div>
        </main>
    );
}
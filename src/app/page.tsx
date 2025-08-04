import ItemList from "@/components/ItemList";

export default function Home() {
	return (
		<main className='min-h-screen flex items-center justify-center bg-gray-700 p-4'>
			<div className='bg-sky-900 p-6 rounded shadow w-full max-w-xl'>
				<ItemList />
			</div>
		</main>
	);
}
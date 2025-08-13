export default function Footer() {
    return (
        <footer className={"bg-sky-900 text-white py-4 my-8"}>
            <div className={"container mx-auto text-center text-sm"}>
                © {new Date().getFullYear()} Grounded Chopping List.
            </div>
        </footer>
    )
}
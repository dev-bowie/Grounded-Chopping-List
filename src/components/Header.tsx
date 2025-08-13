import HeaderActions from "@/components/HeaderActions"
import Navbar from "@/components/Navbar";

export default function Header() {
    return (
        <header
            className={"bg-sky-900 text-white px-4 py-3 flex items-center justify-between shadow-md relative"}>
            <Navbar />
            <div className={"hidden md:block"}>
                <HeaderActions />
            </div>
        </header>
    )
}
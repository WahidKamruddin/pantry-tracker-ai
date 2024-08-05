import Link from "next/link";

const notLoggedIn = () => {
    return ( 
        <div className="h-screen bg-[#f9f9f9] flex flex-col justify-center items-center">
            <h1 className="text-3xl">You're not logged in, login here:</h1>
            <button className='mt-16 px-14 py-8 bg-lime-700 text-white text-2xl rounded-xl hover:bg-lime-600'><Link href="/login">Login</Link></button>
        </div> );
}
 
export default notLoggedIn;
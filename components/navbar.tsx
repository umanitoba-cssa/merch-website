import Link from "next/link";
import React from "react";

export default async function Navbar() {
    return (
        <>
            <div className="w-full p-8">
                <div className="container flex flex-col justify-center h-full p-2 pt-4 pb-4">
                    <Link href="/">
                        <div className="flex flex-row">
                            <img
                                className="fit-content contain h-32 aspect-square"
                                src="https://umanitobacssa.ca/img/logo.png"
                            />
                            <div className="ml-12 flex flex-col justify-center font-sans">
                                <h2 className="text-4xl leading-5 mb-8 flex font-bold">
                                    Computer Science' Students Association
                                </h2>
                                <div className="flex text-3xl mb-1">Merch Store</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}

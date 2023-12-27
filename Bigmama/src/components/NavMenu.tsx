"use client"
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function NavMenu(){
    const supabase = createClientComponentClient();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const {data: { user }} = await supabase.auth.getUser();
            setUser(user);
        };

        checkUser();
    }, []);

    if(user){
        return <NavBar />
    }
}

function NavBar(){
    return (
        <nav>
            <ul className={"flex gap-x-8 items-center w-full justify-between"}>
                <li>
                    <Link href={"/account"}>
                        <div className="button block">Profile</div>
                    </Link>
                </li>
                <li>
                    <Link href={"/dashboard"}>
                        <div className="button block">Dashboard</div>
                    </Link>
                </li>
                <li>
                    <div>
                        <form method="post">
                            <button className="button block" type="submit">
                                Sign out
                            </button>
                        </form>
                    </div>
                </li>
            </ul>
        </nav>
    )
}
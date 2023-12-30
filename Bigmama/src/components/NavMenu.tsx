"use client"
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import {useEffect, useState} from "react";
import {Button} from "@/primitives/Button";

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
        <div className={"flex py-2 gap-x-4 items-center w-full justify-center"}>
            <div>
                <Link href={"/account"}>
                    <Button variant={"subtle"}>Profile</Button>
                </Link>
            </div>
            <div>
                <Link href={"/dashboard"}>
                    <Button variant={"subtle"}>Dashboard</Button>
                </Link>
            </div>
        </div>
    )
}
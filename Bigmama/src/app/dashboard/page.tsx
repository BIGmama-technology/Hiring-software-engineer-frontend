import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import RoomsDisplay from "@/app/dashboard/rooms-display";
import NavMenu from "@/components/NavMenu";
import {Toaster} from "@/shadcnuiComponents/ui/sonner";

export default async function Home() {
    const supabase = createServerComponentClient<any>({cookies})

    const {
        data: {session},
    } = await supabase.auth.getSession();


    return (
        <>
            <NavMenu />
            <Toaster className={"text-black"}/>
            <RoomsDisplay session={session} />
        </>
    )
}

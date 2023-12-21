import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import RoomsDisplay from "@/app/dashboard/rooms-display";

export default async function Home() {
    const supabase = createServerComponentClient<any>({cookies})

    const {
        data: {session},
    } = await supabase.auth.getSession();


    return <RoomsDisplay session={session} />
}

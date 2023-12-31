import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AccountForm from './account-form'
import NavMenu from "@/components/NavMenu";

export default async function Account() {
    const supabase = createServerComponentClient<any>({ cookies })

    const {
        data: { session },
    } = await supabase.auth.getSession()


    return (
        <div className={"max-w-[100svw] min-h-[100svh] bg-black pb-16 overflow-hidden"}>
            <NavMenu />
            <AccountForm session={session} />
        </div>
    )
}
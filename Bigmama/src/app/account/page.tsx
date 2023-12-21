import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AccountForm from './account-form'

export default async function Account() {
    const supabase = createServerComponentClient<any>({ cookies })

    const {
        data: { session },
    } = await supabase.auth.getSession()


    return <AccountForm session={session} />
}
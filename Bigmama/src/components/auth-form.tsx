'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm() {
    const supabase = createClientComponentClient()

    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const {data: { user }} = await supabase.auth.getUser();


            if(user){
                router.push("/dashboard");
            }

        };

        checkUser();
    }, []);
    return (
        <Auth
            supabaseClient={supabase}
            view="magic_link"
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            showLinks={false}
            providers={["discord"]}
            redirectTo="http://localhost:3000/api/auth/callback"
        />
    )
}
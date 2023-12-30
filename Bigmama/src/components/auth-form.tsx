'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLottie } from "Lottie-react";
import animationData from "@/animation/writing_animation.json"

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

    const options = {
        animationData: animationData,
        loop: true
    };

    const { View } = useLottie(options);

    return (
        <div className={"flex flex-col gap-y-3 items-center"}>
            <div className={"w-28 h-28 bg-white rounded-full overflow-hidden"}>
                <div className={"z-50"}>{ View }</div>
            </div>
            <Auth
                supabaseClient={supabase}
                view="sign_in"
                appearance={{ theme: ThemeSupa }}
                theme="dark"
                showLinks={false}
                providers={["discord", "google"]}
                socialLayout={"horizontal"}
                redirectTo="http://localhost:3000/api/auth/callback"
            />
        </div>
    )
}
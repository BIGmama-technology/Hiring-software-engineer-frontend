'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLottie } from "lottie-react";
import animationData from "@/animation/writing_animation.json"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shadcnuiComponents/ui/tabs";

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
            <Tabs defaultValue="login" className={"w-[380px]"}>
                <TabsList className="grid w-full grid-cols-2 bg-black">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="sign_up">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value={"login"}>
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
                </TabsContent>
                <TabsContent value={"sign_up"}>
                    <Auth
                        supabaseClient={supabase}
                        view="sign_up"
                        appearance={{ theme: ThemeSupa }}
                        theme="dark"
                        showLinks={false}
                        providers={["discord", "google"]}
                        socialLayout={"horizontal"}
                        redirectTo="http://localhost:3000/api/auth/callback"
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
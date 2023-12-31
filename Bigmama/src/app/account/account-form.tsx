'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import "@/app/global.css"
import Avatar from "@/app/account/Avatar";
import {HexColorPicker} from "react-colorful";
import { useRouter } from "next/navigation";
import {Input} from "@/primitives/Input";
import {Label} from "@/shadcnuiComponents/ui/label";
import {Toaster} from "@/shadcnuiComponents/ui/sonner";
import {toast} from "sonner";
import {Button} from "@/primitives/Button";
import {Separator} from "@/shadcnuiComponents/ui/separator";

export default function AccountForm({ session }: { session: Session | null }) {
    const supabase = createClientComponentClient<any>()
    const [loading, setLoading] = useState(true)
    const [fullname, setFullname] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [website, setWebsite] = useState<string | null>(null)
    const [avatar_url, setAvatarUrl] = useState<string | null>(null)
    const [profileColor, setProfileColor] = useState<string>('#000000'); // State for profile_color
    const user = session?.user

    const router = useRouter();

    if(!user){
        router.push("/");
    }

    const getProfile = useCallback(async () => {
        try {
            setLoading(true)

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, username, website, avatar_url`)
                .eq('id', user?.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setFullname(data.full_name)
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
                setLoading(false)
            }
        } catch (error) {
            toast('Error loading user data!')
        } finally {
            setLoading(false)
        }
    }, [user, supabase])

    useEffect(() => {
        getProfile()
    }, [user, getProfile])

    async function updateProfile({
                                     username,
                                     website,
                                     avatar_url,
                                 }: {
        username: string | null
        fullname: string | null
        website: string | null
        avatar_url: string | null
    }) {
        try {
            setLoading(true)

            const { error } = await supabase.from('profiles').upsert({
                id: user?.id as string,
                full_name: fullname,
                username,
                website,
                avatar_url,
                profile_color: profileColor,
                updated_at: new Date().toISOString(),
            })
            if (error) throw error
            toast('Profile updated!')
        } catch (error) {
            toast('Error updating the data!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={"px-4 gap-y-3 flex flex-col"}>
            <Toaster />
            <div className={"text-4xl font-bold"}>My profile</div>
            <div className={"flex flex-col md:flex-row justify-between"}>
                <div className={"w-3/4 md:w-1/2"}>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className={"text-gray-300"} htmlFor="email">Email</Label>
                        <Input disabled type="email" id="email" placeholder="Email" value={session?.user.email}/>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className={"text-gray-300"} htmlFor="name">Full Name</Label>
                        <Input type="text" id="fullName" placeholder="Mosbahi Walid" value={fullname || ''} onChange={(e) => setFullname(e.target.value)}/>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className={"text-gray-300"} htmlFor="username">Username</Label>
                        <Input type="text" id="username" placeholder="Bretis2019" value={username || ''} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className={"text-gray-300"} htmlFor="website">Website</Label>
                        <Input type="url" id="website" placeholder="walidmosbahi.me" value={website || ''} onChange={(e) => setWebsite(e.target.value)}/>
                    </div>
                </div>
                <Separator className={"md:hidden my-4"}/>
                <div className={"flex flex-col md:flex-row justify-between w-3/4 md:w-1/2"}>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className={"text-gray-300"} htmlFor="avatar">Profile picture</Label>
                        <Avatar
                            uid={user?.id || ''}
                            url={avatar_url}
                            size={200}
                            onUpload={(url) => {
                                setAvatarUrl(url)
                                updateProfile({ fullname, username, website, avatar_url: url })
                            }}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className={"text-gray-300"} htmlFor="color">Profile Color</Label>
                        <HexColorPicker color={profileColor} onChange={setProfileColor} />
                    </div>
                </div>
            </div>
            <div className={"flex gap-x-4 pb-16"}>
                <div>
                    <form action="/api/auth/signout" method="post">
                        <Button variant={"destructive"} type="submit">
                            Sign out
                        </Button>
                    </form>
                </div>

                <div>
                    <Button
                        variant={"primary"}
                        onClick={() => updateProfile({ fullname, username, website, avatar_url })}
                        disabled={loading}
                    >
                        Update
                    </Button>
                </div>
            </div>
        </div>
    )
}
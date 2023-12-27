'use client'
import { useCallback, useEffect, useState } from 'react'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import "@/app/global.css"
import Avatar from "@/app/account/Avatar";
import {HexColorPicker} from "react-colorful";
import { useRouter } from "next/navigation";

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
            }
        } catch (error) {
            alert('Error loading user data!')
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
            alert('Profile updated!')
        } catch (error) {
            alert('Error updating the data!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="form-widget px-8 py-2">
            <div className={"w-full flex md:flex-row flex-col gap-x-3"}>
                <div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="text" value={session?.user.email} disabled />
                    </div>
                    <div>
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullname || ''}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username || ''}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="website">Website</label>
                        <input
                            id="website"
                            type="url"
                            value={website || ''}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>
                </div>
                <div className={"w-full md:w-fit gap-x-8 flex md:flex-row flex-col items-center"}>
                    <div>
                        <label htmlFor="profileColor">Profile Picture</label>
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

                    <div>
                        <label htmlFor="profileColor">Profile Color</label>
                        <HexColorPicker color={profileColor} onChange={setProfileColor} />
                    </div>
                </div>
            </div>

            <div>
                <button
                    className="button primary block"
                    onClick={() => updateProfile({ fullname, username, website, avatar_url })}
                    disabled={loading}
                >
                    {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>

            <div>
                <form action="/api/auth/signout" method="post">
                    <button className="button block" type="submit">
                        Sign out
                    </button>
                </form>
            </div>
        </div>
    )
}
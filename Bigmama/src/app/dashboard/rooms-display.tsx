'use client'
import { useCallback, useEffect, useState } from 'react'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import "@/app/global.css"
import Link from "next/link";
import { nanoid } from 'nanoid'

export default function RoomsDisplay({ session }: { session: Session | null }) {
    const supabase = createClientComponentClient<any>()
    const [loading, setLoading] = useState(true)
    const [rooms, setRooms] = useState<string[]>([])
    const [title, setTitle] = useState<string>("")

    const user = session?.user

    const getProfile = useCallback(async () => {
        try {
            setLoading(true)

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`rooms`)
                .eq('id', user?.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                if(data.rooms !== null){
                    setRooms(data.rooms)
                }
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
                                     rooms,
                                     title,
                                 }: {
        rooms: string[],
        title: string
    }) {
        try {
            setLoading(true)

            const customId = nanoid(8);

            let treatedTitle = title.replace(/ /g, "_").replace(/\//g, "");

            const roomId = treatedTitle + "/" + customId;

            console.log("roomid",roomId)

            console.log("rooms",rooms)

            const newrooms = [...rooms, roomId]

            console.log("new rooms", newrooms)


            const { error } = await supabase.from('profiles')
                .update({ rooms: newrooms })
                .eq('id', user?.id);

            if (error) throw error
            alert('Profile updated!')
        } catch (error) {
            alert('Error updating the data!')
        } finally {
            setLoading(false)
        }
    }

    const roomsElements = rooms.map((room) => {
        let parts = room.split('/');

        let title = parts[0];
        let id = parts[1];
        return (
            <div>
                <h1>{title}</h1>
                <p>{id}</p>
                <Link href={`/room/?room=${room}`}><div>View Room</div></Link>
            </div>)
    })

    return (
        <div className="form-widget">

            {rooms.length > 0 ? roomsElements : <div>You don't have any rooms</div>}

            <div>
                <div>
                    <label htmlFor="title">Room title</label>
                    <input
                        id="title"
                        type="text"
                        value={title || ''}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <button
                    className="button primary block"
                    onClick={() => updateProfile({ rooms, title })}
                    disabled={loading}
                >
                    {loading ? 'Loading ...' : 'Create Room'}
                </button>
            </div>
        </div>
    )
}
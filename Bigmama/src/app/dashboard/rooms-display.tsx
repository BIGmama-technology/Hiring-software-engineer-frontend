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
    const [showmodal, setShowmodal] = useState(false)
    const [joinroomId, setJoinroomId] = useState<string>("")

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

    async function createRoom({
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

            const newrooms = [...rooms, roomId]



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

    async function joinRoom({
                                rooms,
                                joinroomId,
                            }: {
        rooms: string[],
        joinroomId: string
    }) {
        try {
            setLoading(true)

            const newrooms = [...rooms, joinroomId]



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
            <div className={"border-2 border-gray-500 bg-white rounded-2xl w-fit px-4 py-2 flex flex-col justify-between h-fit gap-y-2"}>
                <h1 className={"text-black text-2xl font-semibold"}>{title}</h1>
                <p className={"text-gray-600"}>id: {id?.length > 0 ? id : "none"}</p>
                <Link href={`/room/?room=${room}`}><div className={"bg-black px-2 py-1 rounded-full w-fit"}>View Room</div></Link>
            </div>)
    })

    return (
        <div className="form-widget px-8 py-2">
            <div className={"w-full flex justify-between"}>
                <div className={"text-4xl font-bold"}>My documents</div>
                <div className={"hidden md:block px-2 py-1 bg-white text-black rounded-lg text-xl cursor-pointer"} onClick={() => setShowmodal((prevState) => !prevState)}>Add new Document</div>
                <div className={"md:hidden px-4 flex justify-center items-center bg-white text-black rounded-full cursor-pointer"} onClick={() => setShowmodal((prevState) => !prevState)}>Add</div>
            </div>
            <div className={"flex flex-wrap gap-4"}>
                {rooms.length > 0 ? roomsElements : <div>You don't have any rooms</div>}
            </div>

            {showmodal && <div className={"w-fit"}>
                <div className={"flex flex-col gap-y-2"}>
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
                        onClick={() => createRoom({ rooms, title })}
                        disabled={loading}
                    >
                        {loading ? 'Loading ...' : 'Create Room'}
                    </button>
                </div>

                <div className={"flex flex-col gap-y-2"}>
                    <div>
                        <label htmlFor="roomid">Room Id</label>
                        <input
                            id="roomId"
                            type="text"
                            value={joinroomId || ''}
                            onChange={(e) => setJoinroomId(e.target.value)}
                        />
                    </div>
                    <button
                        className="button primary block"
                        onClick={() => joinRoom({ rooms, joinroomId })}
                        disabled={loading}
                    >
                        {loading ? 'Loading ...' : 'Join Room'}
                    </button>
                </div>
            </div>}
        </div>
    )
}

import React from "react";


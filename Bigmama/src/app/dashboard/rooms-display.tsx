'use client'
import { useCallback, useEffect, useState, ReactNode } from 'react'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import "@/app/global.css"
import Link from "next/link";
import { nanoid } from 'nanoid'

export default function RoomsDisplay({ session }: { session: Session | null }) {
    const supabase = createClientComponentClient<any>()
    const [loading, setLoading] = useState(true)
    const [rooms, setRooms] = useState<string[]>([])
    const [title, setTitle] = useState<string>("")
    const [joinroomId, setJoinroomId] = useState<string>("")

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

    async function deleteRoom({
                                  rooms,
                                  deleteRoomId,
                              }: {
        rooms: string[];
        deleteRoomId: string;
    }) {
        try {
            setLoading(true);

            // Filter out the room to be deleted
            const newRooms = rooms.filter(room => room !== deleteRoomId);

            const { error } = await supabase.from('profiles')
                .update({ rooms: newRooms })
                .eq('id', user?.id);

            if (error) throw error;
            alert('Profile updated!');
        } catch (error) {
            alert('Error updating the data!');
        } finally {
            setLoading(false);
        }
    }

    const [roomsElements, setRoomsElements] = useState<ReactNode[]>([]);

    useEffect(() => {
        const newRoomsElements = rooms.map((room) => {
            let parts = room.split('/');

            let title = parts[0];
            let id = parts[1];

            return (
                <Card className={"bg-black"}>
                    <CardHeader className={"items-center"}>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription className={"text-gray-300"}>id: {id?.length > 0 ? id : "none"}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between gap-x-8">
                        <Button variant="destructive" onClick={() => deleteRoom({ rooms: rooms, deleteRoomId: room })}>Delete</Button>
                        <Link href={`/room/?room=${room}`}><Button variant={"primary"}>View Room</Button></Link>
                    </CardFooter>
                </Card>

            )
        })

        setRoomsElements(newRoomsElements);

    }, [rooms]);


    return (
        <div className="form-widget px-8 py-2">
            <Drawer>
                <div className={"w-full flex justify-between"}>
                    <div className={"text-4xl font-bold"}>My documents</div>
                    <DrawerTrigger>Add document</DrawerTrigger>
                </div>
                <div className={"flex flex-wrap gap-4"}>
                    {rooms.length > 0 ? roomsElements : <div>You don't have any rooms</div>}
                </div>
                <DrawerContent className={"bg-black"}>
                    <DrawerHeader>
                        <DrawerTitle>Create or join a room</DrawerTitle>
                        <DrawerDescription>If joining a room request the Id from someone that already has access to it</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <div className={"flex flex-col gap-y-8 justify-between w-full"}>
                            <div className={"flex flex-col items-center gap-y-3"}>
                                <label htmlFor="title">Room title</label>
                                <Input id={"title"} value={title || ''}  onChange={(e) => setTitle(e.target.value)}/>
                                <Button disabled={loading} onClick={() => createRoom({ rooms, title })} type="submit">{loading ? 'Loading ...' : 'Create'}</Button>
                            </div>
                            <div className={"flex flex-col items-center gap-y-3"}>
                                <label htmlFor="roomid">Room Id</label>
                                <Input value={joinroomId || ''} onChange={(e) => setJoinroomId(e.target.value)} id={"roomId"}/>
                                <Button onClick={() => joinRoom({ rooms, joinroomId })} disabled={loading}>{loading ? 'Loading ...' : 'Join'}</Button>
                            </div>
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

import React from "react";
import {useRouter} from "next/navigation";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/shadcnuiComponents/ui/card";
import {Button} from "@/primitives/Button";
import {
    Drawer,
    DrawerContent, DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/shadcnuiComponents/ui/drawer";
import {Input} from "@/primitives/Input";


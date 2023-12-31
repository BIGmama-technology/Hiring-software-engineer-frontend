'use client'
import { useCallback, useEffect, useState, ReactNode } from 'react'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import "@/app/global.css"
import Link from "next/link";
import { nanoid } from 'nanoid'
import React from "react";
import {useRouter} from "next/navigation";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/shadcnuiComponents/ui/card";
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
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shadcnuiComponents/ui/tabs";
import ShareIcon from "@/components/ShareIcon";
import {toast} from "sonner";

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
            toast('Error loading user data!')
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
            toast('Profile updated!')
        } catch (error) {
            toast('Error updating the data!')
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
            toast('Profile updated!')
        } catch (error) {
            toast('Error updating the data!')
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
            toast('Profile updated!');
        } catch (error) {
            toast('Error updating the data!');
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
                        <div className={"flex w-full justify-between gap-x-2 items-center"}>
                            <CardTitle>{title}</CardTitle>
                            <ShareIcon textToCopy={room} />
                        </div>
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
                    <DrawerTrigger className={"hidden md:block"}>Add document</DrawerTrigger>
                    <DrawerTrigger className={"md:hidden"}>Add</DrawerTrigger>
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
                        <Tabs defaultValue="create" className="w-[90svw] max-w-[400px] bg-black">
                            <TabsList className="grid w-full grid-cols-2 bg-black">
                                <TabsTrigger value="create">Create</TabsTrigger>
                                <TabsTrigger value="join">Join</TabsTrigger>
                            </TabsList>
                            <TabsContent value="create">
                                <Card className={"bg-black"}>
                                    <CardHeader>
                                        <CardTitle>Create</CardTitle>
                                        <CardDescription>
                                            Create a room.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="space-y-1">
                                            <label htmlFor="title">Room title</label>
                                            <Input id={"title"} value={title || ''}  onChange={(e) => setTitle(e.target.value)}/>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button disabled={loading} onClick={() => createRoom({ rooms, title })} type="submit">{loading ? 'Loading ...' : 'Create'}</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value="join">
                                <Card className={"bg-black"}>
                                    <CardHeader>
                                        <CardTitle>Join</CardTitle>
                                        <CardDescription>
                                            Join a room with it's id.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <label htmlFor="roomid">Room Id</label>
                                        <Input value={joinroomId || ''} onChange={(e) => setJoinroomId(e.target.value)} id={"roomId"}/>
                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={() => joinRoom({ rooms, joinroomId })} disabled={loading}>{loading ? 'Loading ...' : 'Join'}</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

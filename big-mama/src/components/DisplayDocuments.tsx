"use client";
import { deleteDocument } from "@/app/document/action";
import { useTransition } from "react";
import { v4 as uuid } from "uuid";

export default function DisplayDocuments({ rooms }: any) {
  const [isPending, startTransiton] = useTransition();

  //formatting the date before displaying
  const formatedRooms = rooms.map((room: any) => {
    return {
      ...room,
      createdAt: new Date(room.createdAt).toLocaleDateString("en-us", {
        hour: "numeric",
        minute: "numeric",
      }),
    };
  });

  //handel room delete
  async function handleDelete(id: string) {
    startTransiton(async () => {
      const result: any = await deleteDocument(id);
      if (result) {
      } else if (result?.error) {
        console.log(result.error);
      }
    });
  }
  return formatedRooms.map((room: any) => {
    return (
      <div key={uuid()} className="bg-gray-100 bg-opacity-30 p-4">
        <a href={`/document/?roomid=${room.id}`}>
          <h1>{room?.metadata?.title}</h1>
          <div className="flex justify-end">
            <span>{room.createdAt}</span>
          </div>
        </a>
        <div>
          <button
            className=" bg-red-400 px-3 py-1 my-1"
            onClick={() => handleDelete(room.id)}
          >
            delete
          </button>
          <div className={isPending ? "inline-block" : `hidden`}>
        <div className="px-3 mx-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
          Deleting...
        </div>
      </div>
        </div>
      </div>
    );
  });
}

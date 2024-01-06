"use client";

import { ReactNode, useMemo, useRef } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { useSearchParams } from "next/navigation";
import { ClientSideSuspense } from "@liveblocks/react";
import { Loading } from "@/components/Loading";
import LiveCursors from "@/components/LiveCursors";

export function Room({ children }: { children: ReactNode }) {
  const roomId = useOverrideRoomId("nextjs-yjs-quill");

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<Loading />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

export function LiveCursorTracking() {
  const cursorPanel = useRef(null);

  return (
    <main ref={cursorPanel}>
      <LiveCursors cursorPanel={cursorPanel} />
    </main>
  );
}

/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */
function useOverrideRoomId(roomId: string) {
  const params = useSearchParams();
  const roomIdParam = params.get("roomId");

  const overrideRoomId = useMemo(() => {
    return roomIdParam ? `${roomId}-${roomIdParam}` : roomId;
  }, [roomId, roomIdParam]);

  return overrideRoomId;
}

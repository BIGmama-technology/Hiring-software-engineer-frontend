"use client";

import {ReactNode, useMemo, useRef} from "react";
import {RoomProvider, useMyPresence} from "@/liveblocks.config";
import { useSearchParams } from "next/navigation";
import { ClientSideSuspense } from "@liveblocks/react";
import { DocumentSpinner } from "@/primitives/Spinner";
import LiveCursors from "@/components/LiveCursors";
import styles from "./Index.module.css"

export function Room({ children }: { children: ReactNode }) {
  const roomId = useOverrideRoomId("nextjs-yjs-tiptap-advanced");

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<DocumentSpinner />}>
        {() =>
            <>
                <Example />
                {children}
            </>
        }
      </ClientSideSuspense>
    </RoomProvider>
  );
}

function Example() {
  const cursorPanel = useRef<HTMLDivElement | null>(null);
  const [{ cursor }] = useMyPresence();

  const handleMouseDown = () => {
    if (cursorPanel.current) {
      cursorPanel.current.style.pointerEvents = "none";
    }
  };

  const handleMouseUp = () => {
    if (cursorPanel.current) {
      cursorPanel.current.style.pointerEvents = "auto";
    }
  };

  return (
      <div
          ref={cursorPanel}
          className={styles.main}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseUp}
      >
        <LiveCursors cursorPanel={cursorPanel} />
      </div>
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

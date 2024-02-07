"use client";
import { Room } from "@/app/Room";
import { CollaborativeEditor } from "../components/ColaborativeEditor";

import { useMyPresence } from "@/liveblocks.config";
import LiveCursors from "@/components/LiveCursors";
import styles from "./Index.module.css";
import { useEffect, useLayoutEffect, useRef } from "react";

export default function Home() {
  // useEffect(() => {
  //   const container = document.getElementById("toBeDown");
  //   console.log(container);

  //   if (container) {
  //     container.style.zIndex = (10).toString();
  //   }
  // }, []);
  const cursorPanel = useRef(null);
  return (
    <main ref={cursorPanel}>
      <Room>
        <CollaborativeEditor />
        <div className={styles.text}>
          <LiveCursors cursorPanel={cursorPanel} />
        </div>
        {/* <LiveCursorExample /> */}
      </Room>
    </main>
  );
}
// function LiveCursorExample() {
//   const cursorPanel = useRef(null);

//   return (
//     <main ref={cursorPanel} className={styles.main}>
//       <div className={styles.text}>
//         <LiveCursors cursorPanel={cursorPanel} />
//       </div>
//     </main>
//   );
// }
// import { Room } from "./Room";
// import { CollaborativeApp } from "./CollaborativeApp";

// export default function Page() {
//   return (
//     <Room>
//       <CollaborativeApp />
//     </Room>
//   );
// }

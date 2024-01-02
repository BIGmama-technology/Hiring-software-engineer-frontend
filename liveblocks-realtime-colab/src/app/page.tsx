import { LiveCursorTracking, Room } from "@/app/Room";
import { CollaborativeEditor } from "@/components/CollaborativeEditor";

export default function Home() {
  return (
    <main>
      <Room>
        {/* TODO: For now this is not working, I don't kn how to integrate the cursor behavior into the text editor */}
        {/* <LiveCursorTracking /> */}
        <CollaborativeEditor />
      </Room>
    </main>
  );
}

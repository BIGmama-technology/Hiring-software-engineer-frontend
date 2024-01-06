import { Room } from "../Room";
import { CollaborativeEditor } from "@/components/CollaborativeEditor";

export default function LiveBlocksDocs() {
  return (
    <main>
      <Room>
        <CollaborativeEditor />
      </Room>
    </main>
  );
}

import { Room } from "@/app/Room";
import { CollaborativeEditor } from "../components/ColaborativeEditor";

export default function Home() {
  return (
    <main>
      <Room>
        <CollaborativeEditor />
      </Room>
    </main>
  );
}
// import { Room } from "./Room";
// import { CollaborativeApp } from "./CollaborativeApp";

// export default function Page() {
//   return (
//     <Room>
//       <CollaborativeApp />
//     </Room>
//   );
// }

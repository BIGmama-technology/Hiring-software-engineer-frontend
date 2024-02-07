import { Liveblocks } from "@liveblocks/node";
import { createBrowserClient } from "@supabase/ssr";

const supaase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const liveblocks = new Liveblocks({
  secret:
    "sk_dev_tDcBg0Sg0akb4fS1aMuRjO2daig24KqeE0tei3i-9sbVyHv1UFdtFnb6lQBUFmKY",
});

export async function POST(request: Request) {
  // Get the current user from your database
  //   const user = (await supaase.auth.getUser()).data.user;

  //   const userid = user?.id as string;
  //   const user = __getUserFromDB__(request);
  const userid = Math.floor(Math.random() * 10).toString();

  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(`user-${userid}`, {
    userInfo: USER_INFO[Math.floor(Math.random() * 10) % USER_INFO.length],
  });

  // Implement your own security, and give the user access to the room
  const { room } = await request.json();
  //   if (room && __shouldUserHaveAccess__(user, room)) {
  session.allow(room, session.FULL_ACCESS);
  //   }

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}

const USER_INFO = [
  {
    name: "Charlie Layne",
    color: "#D583F0",
    picture: "https://liveblocks.io/avatars/avatar-1.png",
  },
  {
    name: "Mislav Abha",
    color: "#F08385",
    picture: "https://liveblocks.io/avatars/avatar-2.png",
  },
  {
    name: "Tatum Paolo",
    color: "#F0D885",
    picture: "https://liveblocks.io/avatars/avatar-3.png",
  },
  {
    name: "Anjali Wanda",
    color: "#85EED6",
    picture: "https://liveblocks.io/avatars/avatar-4.png",
  },
  {
    name: "Jody Hekla",
    color: "#85BBF0",
    picture: "https://liveblocks.io/avatars/avatar-5.png",
  },
  {
    name: "Emil Joyce",
    color: "#8594F0",
    picture: "https://liveblocks.io/avatars/avatar-6.png",
  },
  {
    name: "Jory Quispe",
    color: "#85DBF0",
    picture: "https://liveblocks.io/avatars/avatar-7.png",
  },
  {
    name: "Quinn Elton",
    color: "#87EE85",
    picture: "https://liveblocks.io/avatars/avatar-8.png",
  },
];

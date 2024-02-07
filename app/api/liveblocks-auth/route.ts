import { createClient } from "@/utils/supabase/server";
import { Liveblocks } from "@liveblocks/node";
import { createBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const secret = process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET;

const liveblocks = new Liveblocks({
  secret: secret as string,
});

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supaase = createClient(cookieStore);
  // Get the current user from your database
  const user = await supaase.auth.getSession();
  // console.log(user.data.session?.user);

  //   const userid = user?.id as string;
  //   const user = __getUserFromDB__(request);
  const userid = Math.floor(Math.random() * 10).toString();

  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    `user-${user.data.session?.user.id}`,
    {
      // userInfo: USER_INFO[Math.floor(Math.random() * 10) % USER_INFO.length],
      userInfo: {
        name: user.data.session?.user.email,
        picture:
          USER_INFO[Math.floor(Math.random() * 10) % USER_INFO.length].picture,
        color:
          USER_INFO[Math.floor(Math.random() * 10) % USER_INFO.length].color,
      },
    }
  );

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
    color: ["#D583F0", "#D583F0"],
    picture: "https://liveblocks.io/avatars/avatar-1.png",
  },
  {
    name: "Mislav Abha",
    color: ["#F08385", "#F08385"],
    picture: "https://liveblocks.io/avatars/avatar-2.png",
  },
  {
    name: "Tatum Paolo",
    color: ["#F0D885", "#F0D885"],
    picture: "https://liveblocks.io/avatars/avatar-3.png",
  },
  {
    name: "Anjali Wanda",
    color: ["#85EED6", "#85EED6"],
    picture: "https://liveblocks.io/avatars/avatar-4.png",
  },
  {
    name: "Jody Hekla",
    color: ["#85BBF0", "#85BBF0"],
    picture: "https://liveblocks.io/avatars/avatar-5.png",
  },
  {
    name: "Emil Joyce",
    color: ["#8594F0", "#8594F0"],
    picture: "https://liveblocks.io/avatars/avatar-6.png",
  },
  {
    name: "Jory Quispe",
    color: ["#85BBF0", "#85BBF0"],
    picture: "https://liveblocks.io/avatars/avatar-7.png",
  },
  {
    name: "Quinn Elton",
    color: ["#87EE85", "#87EE85"],
    picture: "https://liveblocks.io/avatars/avatar-8.png",
  },
];

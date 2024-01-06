import { Liveblocks } from "@liveblocks/node";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
// Authenticating your Liveblocks application
// https://liveblocks.io/docs/rooms/authentication/access-token-permissions/nextjs

const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

const liveblocks = new Liveblocks({
  secret: API_KEY!,
});

export async function POST(request: NextRequest) {
  const supabase = createServerComponentClient<any>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const userId = session?.user.id || "";
    let userData;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", userId);

      if (data && data.length > 0) {
        userData = data[0];
      }
    } catch (error) {
      console.error("Error when getting user data:", error);
    }

    const res = supabase.storage
      .from("avatars")
      .getPublicUrl(userData.avatar_url);

    const publicUrl = res.data.publicUrl;

    const userInfo = {
      name: userData.username,
      color: userData.profile_color || "#F08385",
      picture: publicUrl || "https://liveblocks.io/avatars/avatar-1.png",
    };

    // Create a session for the current user
    const liveblocksSession = liveblocks.prepareSession(`user-${userId}`, {
      userInfo: userInfo,
    });

    // Give the user access to the room
    const { room } = await request.json();
    liveblocksSession.allow(room, liveblocksSession.FULL_ACCESS);

    // Authorize the user and return the result
    const { body, status } = await liveblocksSession.authorize();
    return new Response(body, { status });
  } else {
    // userInfo is made available in Liveblocks presence hooks, e.g. useOthers
    const liveblocksSession = liveblocks.prepareSession(`user-${null}`, {
      userInfo: {},
    });
    // Authorize the user and return the result
    const { body, status } = await liveblocksSession.authorize();
    return new Response(body, { status });
  }
}

// const USER_INFO = [
//   {
//     name: "Charlie Layne",
//     color: "#D583F0",
//     picture: "https://liveblocks.io/avatars/avatar-1.png",
//   },
//   {
//     name: "Mislav Abha",
//     color: "#F08385",
//     picture: "https://liveblocks.io/avatars/avatar-2.png",
//   },
//   {
//     name: "Tatum Paolo",
//     color: "#F0D885",
//     picture: "https://liveblocks.io/avatars/avatar-3.png",
//   },
//   {
//     name: "Anjali Wanda",
//     color: "#85EED6",
//     picture: "https://liveblocks.io/avatars/avatar-4.png",
//   },
//   {
//     name: "Jody Hekla",
//     color: "#85BBF0",
//     picture: "https://liveblocks.io/avatars/avatar-5.png",
//   },
//   {
//     name: "Emil Joyce",
//     color: "#8594F0",
//     picture: "https://liveblocks.io/avatars/avatar-6.png",
//   },
//   {
//     name: "Jory Quispe",
//     color: "#85DBF0",
//     picture: "https://liveblocks.io/avatars/avatar-7.png",
//   },
//   {
//     name: "Quinn Elton",
//     color: "#87EE85",
//     picture: "https://liveblocks.io/avatars/avatar-8.png",
//   },
// ];

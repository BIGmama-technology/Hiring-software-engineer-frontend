import {Liveblocks} from "@liveblocks/node";
import {NextRequest} from "next/server";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";

// Authenticating your Liveblocks application
// https://liveblocks.io/docs/rooms/authentication/access-token-permissions/nextjs

const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

const liveblocks = new Liveblocks({
  secret: API_KEY!,
});

async function getUserData(supabase: any, userIdToRetrieve: string) {
  try {
    // Query the profiles table where userId matches the specified userId
    const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq('id', userIdToRetrieve);

    // Handle errors
    if (error) {
      console.error('Error retrieving user data:', error.message);
      return null;
    }

    // Check if data is available
    if (data && data.length > 0) {
      // User data found
      return data[0];
    } else {
      // User not found
      console.log('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {

  const supabase = createServerComponentClient<any>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if(session){
    const userId = session?.user.id || "";

    const userData = await getUserData(supabase, userId);



    const res  = supabase
        .storage
        .from("avatars")
        .getPublicUrl(userData.avatar_url)


    const publicUrl = res.data.publicUrl




    const userInfo = {
      name: userData.username,
      color: userData.profile_color || "#D583F0",
      picture: publicUrl || "https://liveblocks.io/avatars/avatar-1.png"
    }



    const liveblocksSession = liveblocks.prepareSession(`user-${userId}`, {
      userInfo: userInfo,
    });

    // Give the user access to the room
    const { room } = await request.json();
    liveblocksSession.allow(room, liveblocksSession.FULL_ACCESS);

    // Authorize the user and return the result
    const { body, status } = await liveblocksSession.authorize();
    return new Response(body, { status });
  }else{
    const liveblocksSession = liveblocks.prepareSession(`user-${null}`, {
      userInfo: {},
    });
    const { body, status } = await liveblocksSession.authorize();
    return new Response(body, { status });
  }

}

import { authOptions } from "@/lib/authOptions";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response("Unauthorised", { status: 401 });
    }

    const body = await request.formData();

    const socketId = body.get("socket_id") as string;
    const channel = body.get("channel_name") as string;
    const data = {
      user_id: session.user.id,
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

    return NextResponse.json(authResponse);
  } catch (error) {
    console.log(error);
    NextResponse.json({
      message: "Error in the Post request in pusher-auth/route.ts",
    });
  }
}

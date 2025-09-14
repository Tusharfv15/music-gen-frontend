"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPreSignedUrl } from "~/actions/generation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { SongGrid } from "./song-grid";

export default async function HomeSongsFetcher() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const songs = await db.song.findMany({
    where: {
      OR: [
        // User's own songs (all of them)
        {
          userId: session.user.id
        },
        // Other users' published songs only
        {
          published: true,
          userId: {
            not: session.user.id
          }
        }
      ]
    },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const songsWithThumbnails = await Promise.all(
    songs.map(async (song) => {
      const thumbnailUrl = song.thumbnailS3Key
        ? await getPreSignedUrl(song.thumbnailS3Key)
        : null;

      return {
        id: song.id,
        title: song.title,
        createdAt: song.createdAt,
        instrumental: song.instrumental,
        prompt: song.prompt,
        lyrics: song.lyrics,
        describedLyrics: song.describedLyrics,
        fullDescribedSong: song.fullDescribedSong,
        thumbnailUrl,
        playUrl: null,
        status: song.status,
        createdByUserName: song.user?.name,
        published: song.published,
        isOwnSong: song.userId === session.user.id
      };
    }),
  );

  return <SongGrid songs={songsWithThumbnails} />;
}
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import HomeSongsFetcher from "~/components/home-songs-fetcher";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover Music</h1>
          <p className="text-muted-foreground text-lg">
            Explore amazing songs created by our community
          </p>
        </div>

        <HomeSongsFetcher />
      </div>
    </main>
  );
}

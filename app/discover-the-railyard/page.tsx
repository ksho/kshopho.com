import type { Metadata } from "next";
import { Cobblestone } from "@/components/Cobblestone";
import { railyardGallery, site } from "@/content/site";
import { loadPhotos } from "@/lib/photos";

const title = `Discover the Railyard - ${site.description}`;

export const metadata: Metadata = {
  title,
  alternates: { canonical: "/discover-the-railyard" },
  openGraph: { title, url: "/discover-the-railyard" },
};

export default async function RailyardPage() {
  const photos = await loadPhotos(railyardGallery, "Discover the Railyard - Karl Shouler");
  return (
    <>
      <section className="prose">
        <div className="prose__inner">
          <h2>Discover the Railyard</h2>
          <p>
            On display at{" "}
            <a href="http://www.gravy-studio.com/karl-shouler-1/" target="_blank" rel="noopener noreferrer">
              Gravy Studio
            </a>{" "}
            for June 2015 -- a project exploring the abandoned Reading Viaduct -- an elevated railway above
            the Callowhill neighborhood of Philadelphia.
            <br />
            <br />
            All displayed 24x16&apos;s are limited to 5 prints. Smaller prints also available.
          </p>
          <p>
            Event RSVP: &nbsp;
            <a href="https://www.facebook.com/events/373459476175988/" target="_blank" rel="noopener noreferrer">
              https://www.facebook.com/events/373459476175988/
            </a>
          </p>
        </div>
      </section>
      <Cobblestone photos={photos} />
    </>
  );
}

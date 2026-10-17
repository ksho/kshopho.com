import { Filmstrip } from "@/components/Filmstrip";
import { homeGallery } from "@/content/site";
import { loadPhotos } from "@/lib/photos";

export default async function HomePage() {
  const photos = await loadPhotos(homeGallery, "Home - Karl Shouler");
  return <Filmstrip photos={photos} />;
}

import { GameStage } from "@/components/game/GameStage";
import { fetchGalleryFromContentful } from "@/lib/cms/contentful-gallery";
import { GALLERY } from "@/lib/content/gallery";

export default async function Home() {
  const gallery = (await fetchGalleryFromContentful()) ?? GALLERY;
  return <GameStage gallery={gallery} />;
}

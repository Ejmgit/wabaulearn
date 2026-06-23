import ClinicalNews from "@/components/ClinicalNews";
import HeroSection from "./../components/Herosection";
import { getPostData } from "@/sanity/lib/queries";

export default async function Home() {
  const postData = await getPostData();
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <ClinicalNews postData={postData} />
    </div>
  );
}

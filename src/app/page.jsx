// import ClinicalNews from "@/components/ClinicalNews";
import HeroSection from "./../components/Herosection";
import { getPostData } from "@/sanity/lib/queries";
import ClinicalNewsCard from "./clinicalnews/ClinicalNews";

export default async function Home() {
  const postData = await getPostData();
  return (
    <div className="min-h-screen ">
      <HeroSection />
      <ClinicalNewsCard postData={postData} />
    </div>
  );
}

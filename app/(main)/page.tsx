import {
  HeroSection,
  TrustTriggers,
  CatalogPreview,
  WhyUs,
  LeadFormSection,
} from "@/components/home";
import { getFeaturedMachinesSerialized, getCategoriesSerialized, getMachinesCount } from "@/lib/data";

export default async function Home() {
  const [machines, categories, totalCount] = await Promise.all([
    getFeaturedMachinesSerialized(6),
    getCategoriesSerialized(),
    getMachinesCount(),
  ]);

  return (
    <>
      <HeroSection />
      <TrustTriggers />
      <CatalogPreview 
        machines={machines} 
        categories={categories} 
        totalCount={totalCount} 
      />
      <WhyUs />
      <LeadFormSection />
    </>
  );
}

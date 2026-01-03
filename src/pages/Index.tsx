import Layout from "@/components/Layout";
import HeroSection from "@/components/home/HeroSection";
import AboutPreview from "@/components/home/AboutPreview";
import ServicesPreview from "@/components/home/ServicesPreview";
import ValueProposition from "@/components/home/ValueProposition";
import TestimonialsPreview from "@/components/home/TestimonialsPreview";
import AwardsPreview from "@/components/home/AwardsPreview";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutPreview />
      <ServicesPreview />
      <ValueProposition />
      <TestimonialsPreview />
      <AwardsPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;

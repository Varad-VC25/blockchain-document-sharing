import Navbar from "@components/landing/Navbar";
import Hero from "@components/landing/Hero";
import Features from "@components/landing/Features";
import HowItWorks from "@components/landing/HowItWorks";
import Statistics from "@components/landing/Statistics";
import UseCases from "@components/landing/UseCases";
import Testimonials from "@components/landing/Testimonials";
import FAQ from "@components/landing/FAQ";
import CTA from "@components/landing/CTA";
import Footer from "@components/landing/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Statistics />
      <UseCases />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;

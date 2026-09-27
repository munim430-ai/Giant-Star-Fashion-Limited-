import { About } from "@/components/About";
import { Capacity } from "@/components/Capacity";
import { ClientMarquee } from "@/components/ClientMarquee";
import { Compliance } from "@/components/Compliance";
import { ContactSection } from "@/components/ContactSection";
import { FactoryTour } from "@/components/FactoryTour";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MachineryTable } from "@/components/MachineryTable";
import { Metrics } from "@/components/Metrics";
import { Navbar } from "@/components/Navbar";
import { ProcessFlow } from "@/components/ProcessFlow";
import { ProductGrid } from "@/components/ProductGrid";
import { company, leadership, locations, workforce } from "@/data/factoryData";
import { siteUrl } from "@/lib/utils";

function OrganizationJsonLd() {
  const url = siteUrl();
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    alternateName: company.acronym,
    url,
    logo: `${url}/logo.png`,
    email: company.generalEmail,
    foundingDate: String(company.established),
    description: company.summary,
    numberOfEmployees: { "@type": "QuantitativeValue", value: workforce.total },
    address: {
      "@type": "PostalAddress",
      streetAddress: locations[0].lines.slice(0, 2).join(", "),
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    location: locations.map((l) => ({
      "@type": "Place",
      name: `${company.name} — ${l.label}`,
      address: { "@type": "PostalAddress", streetAddress: l.lines.join(", "), addressCountry: "BD" },
    })),
    contactPoint: leadership.map((l) => ({
      "@type": "ContactPoint",
      contactType: "sales",
      name: l.name,
      telephone: l.phones[0].href.replace("tel:", ""),
      email: l.email,
      availableLanguage: ["English", "Bengali"],
    })),
    memberOf: { "@type": "Organization", name: "Bangladesh Garment Manufacturers and Exporters Association (BGMEA)" },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Metrics />
        <About />
        <MachineryTable />
        <FactoryTour />
        <Capacity />
        <ProcessFlow />
        <ProductGrid />
        <Compliance />
        <ClientMarquee />
        <ContactSection />
      </main>
      <Footer />
      <OrganizationJsonLd />
    </>
  );
}

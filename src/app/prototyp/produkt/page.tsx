import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isProductionDeployment } from "@/config/environment";
import { ProductEditorialPage } from "@/features/product-prototype/editorial-page";

export const metadata: Metadata = {
  title: "Produktgeschichte — Prototyp | LICHTSAUM",
  description: "Interne Gestaltungsstudie: Stoff, Form und Schrift im Licht.",
  alternates: { canonical: null }, openGraph: null, twitter: null,
  robots: { index: false, follow: false, nocache: true }
};

export default function ProductEditorialPrototype() {
  if (isProductionDeployment) notFound();
  return <ProductEditorialPage />;
}

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="plain-page">
      <p className="eyebrow">404</p>
      <h1>Diese Seite gibt es nicht.</h1>
      <p>Die angeforderte Seite ist in diesem Stand nicht verfügbar.</p>
      <Link className="button button--primary" href="/">
        Zur Startseite
      </Link>
    </main>
  );
}

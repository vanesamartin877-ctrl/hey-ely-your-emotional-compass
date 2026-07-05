import { createFileRoute, Link } from "@tanstack/react-router";
import { ElyMascot } from "@/components/brand";

export const Route = createFileRoute("/web/inicio")({
  head: () => ({ meta: [{ title: "Hey Ely — Sitio oficial" }] }),
  component: () => (
    <div className="text-center py-10">
      <ElyMascot className="w-64 mx-auto" />
      <h1 className="mt-6 text-4xl font-extrabold">Bienvenido al sitio oficial de Hey Ely</h1>
      <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
        Aquí encontrarás información sobre nuestra plataforma, recursos, noticias y formas de contacto.
      </p>
      <Link to="/auth" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-primary-foreground font-bold shadow-soft">
        Ingresar a la aplicación
      </Link>
    </div>
  ),
});

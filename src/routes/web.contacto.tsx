import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/web/contacto")({
  head: () => ({ meta: [{ title: "Contacto — Hey Ely" }] }),
  component: () => (
    <div>
      <h1 className="text-4xl font-extrabold">Contacto</h1>
      <p className="mt-2 text-muted-foreground">Escríbenos para saber más sobre Hey Ely.</p>
      <div className="mt-6 card-soft p-6 space-y-2">
        <div><strong>Correo:</strong> hola@heyely.app</div>
        <div><strong>Ubicación:</strong> Valle de Tenza, Boyacá — Colombia</div>
      </div>
    </div>
  ),
});

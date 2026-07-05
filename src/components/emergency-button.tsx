import { Link } from "@tanstack/react-router";
import { AlertCircle, Phone } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CONTACTS = [
  { name: "Línea 106 - Salud mental Bogotá", phone: "106", desc: "Atención emocional 24/7" },
  { name: "Línea Nacional de Prevención del Suicidio", phone: "192", desc: "Ministerio de Salud - Colombia" },
  { name: "ICBF — Bienestar Familiar", phone: "141", desc: "Protección de niños, niñas y adolescentes" },
  { name: "Línea Púrpura Distrital", phone: "018000112137", desc: "Violencia contra la mujer" },
  { name: "Policía Nacional", phone: "123", desc: "Emergencias" },
  { name: "Salud mental Boyacá", phone: "+57 608 7420150", desc: "Secretaría de Salud de Boyacá" },
  { name: "Hospital Valle de Tenza", phone: "+57 608 7500123", desc: "Urgencias regionales" },
];

export function EmergencyButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-destructive px-4 py-3 text-destructive-foreground font-bold shadow-soft hover:scale-105 transition md:bottom-6"
        aria-label="Botón de emergencia"
      >
        <AlertCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Emergencia</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Estás en un lugar seguro</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Si tú o alguien que conoces está en riesgo, contacta ahora una de estas líneas oficiales.
            No estás solo/a.
          </p>
          <div className="mt-4 space-y-2 max-h-[50vh] overflow-auto">
            {CONTACTS.map((c) => (
              <a key={c.phone} href={`tel:${c.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 rounded-2xl border p-3 hover:bg-secondary transition">
                <div className="rounded-full bg-primary/10 p-2 text-primary"><Phone className="h-5 w-5" /></div>
                <div className="flex-1">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.desc}</div>
                </div>
                <div className="font-mono font-bold">{c.phone}</div>
              </a>
            ))}
          </div>
          <div className="mt-3 rounded-2xl gradient-hero p-4 text-white">
            <div className="font-bold">¿Qué hacer en una crisis?</div>
            <ul className="mt-1 text-sm list-disc list-inside space-y-0.5">
              <li>Busca un lugar tranquilo y seguro.</li>
              <li>Habla con un adulto de confianza.</li>
              <li>Llama a una línea de ayuda oficial.</li>
              <li>Si hay riesgo inmediato, marca 123.</li>
            </ul>
          </div>
          <Link to="/web/inicio" onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-primary text-center px-4 py-3 text-primary-foreground font-semibold">
            Visitar la página web oficial de Hey Ely
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}

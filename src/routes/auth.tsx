import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogoMark, ElyMascot } from "@/components/brand";
import { toast } from "sonner";
import { Search } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Ingresar — Hey Ely" }] }),
  component: AuthPage,
});

type Mode = "signin" | "student" | "admin" | "natural";

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const { data: p } = await supabase.from("profiles").select("user_type").eq("id", data.session.user.id).maybeSingle();
        navigate({ to: p?.user_type === "admin" ? "/admin" : "/app" });
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <Link to="/"><LogoMark /></Link>
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold">Hola, soy <span className="text-gradient-ely">Ely</span></h1>
          <p className="mt-3 text-muted-foreground">Elige cómo quieres empezar. Es rápido y seguro.</p>
          <div className="mt-6 hidden md:block">
            <ElyMascot className="w-64" />
          </div>
        </div>
        <div className="card-soft p-6 md:p-8">
          {mode === "signin" && <SignIn onSwitch={setMode} />}
          {mode === "student" && <StudentSignUp onBack={() => setMode("signin")} />}
          {mode === "admin" && <AdminSignUp onBack={() => setMode("signin")} />}
          {mode === "natural" && <NaturalSignUp onBack={() => setMode("signin")} />}
        </div>
      </div>
    </div>
  );
}

function SignIn({ onSwitch }: { onSwitch: (m: Mode) => void }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    const { data: p } = await supabase.from("profiles").select("user_type").eq("id", data.user.id).maybeSingle();
    toast.success("¡Bienvenido/a de vuelta!");
    navigate({ to: p?.user_type === "admin" ? "/admin" : "/app" });
  }
  return (
    <div>
      <h2 className="text-2xl font-extrabold">Iniciar sesión</h2>
      <p className="text-sm text-muted-foreground">Continúa tu camino con Ely.</p>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <input type="email" required placeholder="Correo" className="w-full rounded-2xl border p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required placeholder="Contraseña" className="w-full rounded-2xl border p-3" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full rounded-full bg-primary text-primary-foreground py-3 font-bold shadow-soft disabled:opacity-60">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <div className="mt-6 text-sm">
        <div className="font-bold mb-2">¿Aún no tienes cuenta?</div>
        <div className="grid gap-2">
          <button onClick={() => onSwitch("student")} className="rounded-2xl border p-3 text-left hover:bg-secondary"><span className="font-bold">Soy estudiante</span> <span className="text-muted-foreground">— pertenezco a un colegio</span></button>
          <button onClick={() => onSwitch("natural")} className="rounded-2xl border p-3 text-left hover:bg-secondary"><span className="font-bold">Soy usuario natural</span> <span className="text-muted-foreground">— sin institución</span></button>
          <button onClick={() => onSwitch("admin")} className="rounded-2xl border p-3 text-left hover:bg-secondary"><span className="font-bold">Soy administrador institucional</span> <span className="text-muted-foreground">— rector, psicorientador, etc.</span></button>
        </div>
      </div>
    </div>
  );
}

function StudentSignUp({ onBack }: { onBack: () => void }) {
  const [f, setF] = useState({ full_name: "", age: "", grade: "", course: "", email: "", password: "" });
  const [inst, setInst] = useState<{ id: string; name: string; city: string } | null>(null);
  const [q, setQ] = useState(""); const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      const { data } = await supabase.from("institutions").select("id,name,city,department").ilike("name", `%${q}%`).limit(8);
      setResults(data ?? []);
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!inst) return toast.error("Selecciona tu institución");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: f.email, password: f.password,
      options: { data: { user_type: "student", full_name: f.full_name, age: f.age, grade: f.grade, course: f.course } },
    });
    if (error || !data.user) { setLoading(false); return toast.error(error?.message ?? "Error"); }
    // Attach institution
    await supabase.from("profiles").update({ institution_id: inst.id }).eq("id", data.user.id);
    setLoading(false);
    toast.success(`¡Bienvenido/a, ${f.full_name.split(" ")[0]}!`);
    navigate({ to: "/app" });
  }
  return (
    <div>
      <button onClick={onBack} className="text-xs text-muted-foreground">← Volver</button>
      <h2 className="mt-1 text-2xl font-extrabold">Soy estudiante</h2>
      <form onSubmit={submit} className="mt-4 space-y-2">
        <input required placeholder="Nombre completo" className="w-full rounded-2xl border p-3" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} />
        <div className="grid grid-cols-3 gap-2">
          <input required type="number" min={8} max={30} placeholder="Edad" className="rounded-2xl border p-3" value={f.age} onChange={(e) => setF({ ...f, age: e.target.value })} />
          <input required placeholder="Grado" className="rounded-2xl border p-3" value={f.grade} onChange={(e) => setF({ ...f, grade: e.target.value })} />
          <input placeholder="Curso (opc.)" className="rounded-2xl border p-3" value={f.course} onChange={(e) => setF({ ...f, course: e.target.value })} />
        </div>
        <input required type="email" placeholder="Correo" className="w-full rounded-2xl border p-3" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input required type="password" minLength={8} placeholder="Contraseña (mín. 8)" className="w-full rounded-2xl border p-3" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />

        <div className="rounded-2xl border p-3">
          <div className="text-sm font-bold mb-1">Institución</div>
          {inst ? (
            <div className="flex items-center justify-between">
              <div><div className="font-semibold">{inst.name}</div><div className="text-xs text-muted-foreground">{inst.city}</div></div>
              <button type="button" onClick={() => setInst(null)} className="text-xs underline">Cambiar</button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-xl border px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input placeholder="Busca tu colegio..." value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" />
              </div>
              {results.length > 0 && (
                <div className="mt-2 space-y-1 max-h-40 overflow-auto">
                  {results.map((r) => (
                    <button key={r.id} type="button" onClick={() => setInst(r)} className="w-full text-left rounded-xl border p-2 hover:bg-secondary">
                      <div className="text-sm font-semibold">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.city}, {r.department}</div>
                    </button>
                  ))}
                </div>
              )}
              {q && results.length === 0 && <div className="mt-2 text-xs text-muted-foreground">No se encontraron instituciones. Pide al administrador de tu colegio que registre la institución.</div>}
            </>
          )}
        </div>

        <button disabled={loading} className="w-full rounded-full bg-primary text-primary-foreground py-3 font-bold shadow-soft disabled:opacity-60">
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}

function AdminSignUp({ onBack }: { onBack: () => void }) {
  const [f, setF] = useState({ full_name: "", position: "", institution: "", city: "", department: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    // Check duplicate institution
    const { data: exists } = await supabase.from("institutions").select("id").ilike("name", f.institution).ilike("city", f.city).ilike("department", f.department).maybeSingle();
    if (exists) { setLoading(false); return toast.error("Esta institución ya está registrada."); }

    const { data, error } = await supabase.auth.signUp({
      email: f.email, password: f.password,
      options: { data: { user_type: "admin", full_name: f.full_name, position: f.position } },
    });
    if (error || !data.user) { setLoading(false); return toast.error(error?.message ?? "Error"); }

    const slug = `${slugify(f.institution)}-${slugify(f.city)}-${Date.now().toString(36)}`;
    const { data: instRow, error: e2 } = await supabase.from("institutions").insert({
      name: f.institution, city: f.city, department: f.department, admin_user_id: data.user.id, slug,
    }).select().single();

    if (e2 || !instRow) { setLoading(false); return toast.error(e2?.message ?? "No se pudo crear la institución"); }
    await supabase.from("profiles").update({ institution_id: instRow.id }).eq("id", data.user.id);
    setLoading(false);
    toast.success("Institución registrada con éxito");
    navigate({ to: "/admin" });
  }
  return (
    <div>
      <button onClick={onBack} className="text-xs text-muted-foreground">← Volver</button>
      <h2 className="mt-1 text-2xl font-extrabold">Registro institucional</h2>
      <p className="text-xs text-muted-foreground">Para rectores, psicorientadores y coordinadores.</p>
      <form onSubmit={submit} className="mt-4 space-y-2">
        <input required placeholder="Nombre completo" className="w-full rounded-2xl border p-3" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} />
        <input required placeholder="Cargo (rector, psicorientador...)" className="w-full rounded-2xl border p-3" value={f.position} onChange={(e) => setF({ ...f, position: e.target.value })} />
        <input required placeholder="Nombre oficial de la institución" className="w-full rounded-2xl border p-3" value={f.institution} onChange={(e) => setF({ ...f, institution: e.target.value })} />
        <div className="grid grid-cols-2 gap-2">
          <input required placeholder="Ciudad" className="rounded-2xl border p-3" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
          <input required placeholder="Departamento" className="rounded-2xl border p-3" value={f.department} onChange={(e) => setF({ ...f, department: e.target.value })} />
        </div>
        <input required type="email" placeholder="Correo institucional" className="w-full rounded-2xl border p-3" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input required type="password" minLength={8} placeholder="Contraseña (mín. 8)" className="w-full rounded-2xl border p-3" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <button disabled={loading} className="w-full rounded-full bg-primary text-primary-foreground py-3 font-bold shadow-soft disabled:opacity-60">
          {loading ? "Creando..." : "Registrar institución"}
        </button>
      </form>
    </div>
  );
}

function NaturalSignUp({ onBack }: { onBack: () => void }) {
  const [f, setF] = useState({ full_name: "", age: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: f.email, password: f.password,
      options: { data: { user_type: "natural", full_name: f.full_name, age: f.age } },
    });
    setLoading(false);
    if (error || !data.user) return toast.error(error?.message ?? "Error");
    toast.success(`¡Bienvenido/a, ${f.full_name.split(" ")[0]}!`);
    navigate({ to: "/app" });
  }
  return (
    <div>
      <button onClick={onBack} className="text-xs text-muted-foreground">← Volver</button>
      <h2 className="mt-1 text-2xl font-extrabold">Cuenta personal</h2>
      <form onSubmit={submit} className="mt-4 space-y-2">
        <input required placeholder="Nombre" className="w-full rounded-2xl border p-3" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} />
        <input required type="number" min={8} placeholder="Edad" className="w-full rounded-2xl border p-3" value={f.age} onChange={(e) => setF({ ...f, age: e.target.value })} />
        <input required type="email" placeholder="Correo" className="w-full rounded-2xl border p-3" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input required type="password" minLength={8} placeholder="Contraseña (mín. 8)" className="w-full rounded-2xl border p-3" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <button disabled={loading} className="w-full rounded-full bg-primary text-primary-foreground py-3 font-bold shadow-soft disabled:opacity-60">
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}

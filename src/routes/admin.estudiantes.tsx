import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/estudiantes")({ component: StudentsList });

function StudentsList() {
  const { user } = useSession();
  const { data: inst } = useQuery({
    queryKey: ["my-inst", user?.id], enabled: !!user,
    queryFn: async () => (await supabase.from("institutions").select("id").eq("admin_user_id", user!.id).maybeSingle()).data,
  });
  const { data } = useQuery({
    queryKey: ["students-full", inst?.id], enabled: !!inst,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("institution_id", inst!.id).eq("user_type", "student").order("full_name")).data ?? [],
  });
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Estudiantes</h1>
      <div className="mt-4 card-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left"><tr>
            <th className="p-3">Nombre</th><th className="p-3">Edad</th><th className="p-3">Grado</th><th className="p-3">Curso</th><th className="p-3">Nivel</th><th className="p-3">XP</th>
          </tr></thead>
          <tbody>
            {data?.map((s: any) => (
              <tr key={s.id} className="border-t">
                <td className="p-3 font-semibold">{s.full_name}</td>
                <td className="p-3">{s.age ?? "-"}</td>
                <td className="p-3">{s.grade ?? "-"}</td>
                <td className="p-3">{s.course ?? "-"}</td>
                <td className="p-3">{s.level}</td>
                <td className="p-3">{s.xp}</td>
              </tr>
            ))}
            {data?.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Aún no hay estudiantes registrados</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

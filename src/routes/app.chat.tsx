import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession, useProfile } from "@/lib/session";
import { ElyMascot } from "@/components/brand";
import { Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/chat")({ component: ChatPage });

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const { user } = useSession();
  const { profile } = useProfile(user?.id);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("chat_messages").select("role,content").eq("user_id", user.id).order("created_at").then(({ data }) => {
      if (data && data.length) setMessages(data as Msg[]);
      else if (profile) setMessages([{ role: "assistant", content: `Hola, ${profile.full_name.split(" ")[0]} 👋 Qué bueno verte. ¿Cómo te sientes hoy?` }]);
    });
  }, [user, profile]);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user || !profile) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next); setInput(""); setSending(true);
    await supabase.from("chat_messages").insert({ user_id: user.id, role: "user", content: userMsg.content });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, userName: profile.full_name.split(" ")[0], userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      const reply: Msg = { role: "assistant", content: data.reply };
      setMessages((m) => [...m, reply]);
      await supabase.from("chat_messages").insert({ user_id: user.id, role: "assistant", content: reply.content });
      if (data.riskDetected) toast.warning("Ely detectó una situación importante. Recuerda que puedes usar el botón de emergencia si lo necesitas.");
    } catch (err: any) {
      toast.error(err.message);
      setMessages((m) => [...m, { role: "assistant", content: "Perdona, tuve un problema para responder. ¿Intentamos de nuevo?" }]);
    } finally { setSending(false); }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-soft p-4 flex items-center gap-3">
        <ElyMascot className="w-16 h-16" />
        <div>
          <div className="font-extrabold">Chat con Ely</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Conversación 100% privada.</div>
        </div>
      </div>

      <div ref={listRef} className="mt-4 h-[55vh] overflow-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`animate-pop flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "gradient-hero text-white" : "card-soft"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {sending && <div className="text-xs text-muted-foreground pl-2">Ely está escribiendo...</div>}
      </div>

      <form onSubmit={send} className="mt-3 flex gap-2">
        <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escríbele a Ely..." className="flex-1 rounded-full border px-4 py-3" />
        <button disabled={sending || !input.trim()} className="rounded-full bg-primary text-primary-foreground px-5 font-bold disabled:opacity-50">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

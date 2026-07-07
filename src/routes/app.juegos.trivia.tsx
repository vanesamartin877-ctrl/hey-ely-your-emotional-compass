import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession, useProfile } from "@/lib/session";
import { toast } from "sonner";

export const Route = createFileRoute("/app/juegos/trivia")({ component: Trivia });

// Banco de 50 preguntas exhaustivas sobre bienestar y salud mental con exactamente 3 opciones
const ALL_QUESTIONS = [
  { q: "¿Qué técnica te ayuda a calmarte en un momento de ansiedad?", opts: ["Respirar profundo", "Ignorarlo", "Comer rápido"], correct: 0 },
  { q: "El bullying es...", opts: ["Una broma inofensiva", "Una forma de violencia repetida", "Un juego"], correct: 1 },
  { q: "Sentir tristeza a veces es...", opts: ["Malo", "Normal y humano", "Un fracaso"], correct: 1 },
  { q: "Ante una crisis emocional puedes...", opts: ["Aislarte totalmente", "Hablar con alguien de confianza", "Publicarlo en redes"], correct: 1 },
  { q: "La autoestima se construye...", opts: ["Comparándote", "Día a día con acciones", "Al azar"], correct: 1 },
  { q: "¿Qué es la inteligencia emocional?", opts: ["Reprimir todo lo negativo", "Entender y gestionar tus emociones", "Tener notas perfectas"], correct: 1 },
  { q: "Si sientes mucha rabia, una respuesta asertiva es:", opts: ["Gritarle a quien esté cerca", "Pausar, respirar y hablar luego", "Guardártelo para siempre"], correct: 1 },
  { q: "La función principal del miedo es:", opts: ["Hacerte débil", "Protegerte ante un peligro", "Hacerte fracasar"], correct: 1 },
  { q: "Validar una emoción significa:", opts: ["Aceptar el derecho a sentirla", "Aprobar conductas destructivas", "Darle la razón a todos"], correct: 0 },
  { q: "Tener buena autoestima implica:", opts: ["Creer que nunca te equivocas", "Aceptarte buscando mejorar", "Sentirte superior a todos"], correct: 1 },
  { q: "Cuando cometes un error grave, un autodiálogo sano es:", opts: ["'Soy un fracaso total'", "'Es parte de aprender, mejoraré'", "'No me importa nada'"], correct: 1 },
  { q: "¿Qué acción debilita activamente tu autoestima?", opts: ["Poner límites claros", "Compararte en redes sociales", "Celebrar tus pequeños logros"], correct: 1 },
  { q: "¿Qué caracteriza a un trastorno de ansiedad frente al estrés?", opts: ["Es imaginario", "Es intenso, persistente y paralizante", "Dura solo cinco minutos"], correct: 1 },
  { q: "Una técnica de primer auxilio ante la ansiedad es:", opts: ["La respiración diafragmática", "Correr hasta agotarse", "Pensar en cosas tristes"], correct: 0 },
  { q: "¿Qué es el Mindfulness?", opts: ["Tener la mente en blanco", "Atención plena en el presente", "Planificar el futuro"], correct: 1 },
  { q: "El estrés crónico puede provocar físicamente:", opts: ["Mayor fuerza permanente", "Dolores de cabeza y tensión muscular", "Ninguna, solo afecta la mente"], correct: 1 },
  { q: "Si presencias que acosan a un compañero, debes:", opts: ["Grabar un video de la burla", "Reportarlo a un adulto de confianza", "No meterte para evitar problemas"], correct: 1 },
  { q: "El acoso escolar o bullying se define por ser:", opts: ["Un desacuerdo aislado", "Intencionado, repetitivo y desigual", "Un juego pesado de roles"], correct: 1 },
  { q: "El ciberbullying se caracteriza por:", opts: ["Bromas cara a cara", "Acoso a través de medios digitales", "Correos formales a profesores"], correct: 1 },
  { q: "¿Qué significa tener empatía?", opts: ["Sentir lástima por los demás", "Comprender la perspectiva ajena", "Dar consejos acelerados"], correct: 1 },
  { q: "Para una escucha empática y activa se debe:", opts: ["Interrumpir con tu historia", "Prestar atención total sin juzgar", "Mirar el móvil mientras te hablan"], correct: 1 },
  { q: "La comunicación asertiva consiste en:", opts: ["Expresarte con claridad y respeto", "Imponer tus ideas a la fuerza", "Callar para evitar problemas"], correct: 0 },
  { q: "Un ejemplo de conducta pasivo-agresiva es:", opts: ["Decir calmadamente lo que molesta", "Decir 'no pasa nada' tirando cosas", "Gritar abiertamente a alguien"], correct: 1 },
  { q: "Decir 'no' cuando no tienes tiempo o energía es:", opts: ["Un acto de egoísmo puro", "Un límite sano y necesario", "Una falta de educación"], correct: 1 },
  { q: "La resiliencia es la capacidad de:", opts: ["Adaptarse y salir fortalecido", "Ser invulnerable al dolor", "Evitar cualquier riesgo"], correct: 0 },
  { q: "Buscar apoyo psicológico profesional es un signo de:", opts: ["Debilidad mental", "Valentía y autocuidado", "Haber perdido el juicio"], correct: 1 },
  { q: "Un mito común sobre la salud mental es:", opts: ["Afecta a cualquier persona", "Se cura solo con 'echarle ganas'", "El estilo de vida influye"], correct: 1 },
  { q: "El autocuidado real se basa en:", opts: ["Comprar cosas caras seguidas", "Hábitos sanos y límites sostenibles", "Aislarse del mundo exterior"], correct: 1 },
  { q: "¿Cuántas horas se recomienda dormir para una buena salud mental?", opts: ["De 4 a 5 horas", "De 7 a 9 horas", "Más de 14 horas"], correct: 1 },
  { q: "Una buena higiene del sueño incluye:", opts: ["Mirar redes antes de dormir", "Evitar pantallas antes de acostarse", "Tomar cafeína por la noche"], correct: 1 },
  { q: "¿Qué promueve una buena convivencia escolar?", opts: ["El respeto a las diferencias", "Ignorar las normas comunes", "La competencia destructiva"], correct: 0 },
  { q: "Si un amigo te confiesa que se autolesiona, debes:", opts: ["Guardar el secreto absoluto", "Buscar ayuda de un adulto idóneo", "Decirle que busca atención"], correct: 1 },
  { q: "El autoconcepto es:", opts: ["La opinión crítica de tus padres", "La descripción mental que tienes de ti", "Tus seguidores en internet"], correct: 1 },
  { q: "Una emoción secundaria es aquella que:", opts: ["Nace de forma biológica pura", "Surge de juzgar la emoción primaria", "No tiene utilidad alguna"], correct: 1 },
  { q: "El agotamiento extremo por estrés prolongado es:", opts: ["Síndrome de Burnout", "Un ataque de pánico aislado", "Un tic nervioso temporal"], correct: 0 },
  { q: "Para resolver un conflicto constructivamente se debe:", opts: ["Atacar a la otra persona", "Centrarse en solucionar el problema", "Gritar más fuerte que el otro"], correct: 1 },
  { q: "Sentir envidia recurrente puede avisarte de:", opts: ["Que eres una persona malvada", "Deseos propios que debes atender", "Que todos están en tu contra"], correct: 1 },
  { q: "La neuroplasticidad cerebral se estimula:", opts: ["Aprendiendo nuevas habilidades", "Haciendo siempre lo mismo", "Evitando leer y estudiar"], correct: 0 },
  { q: "Un pilar clave de la resiliencia es:", opts: ["Tener una red de apoyo sólida", "No pedir ayuda jamás", "Ocultar lo que te pasa"], correct: 0 },
  { q: "La frustración aparece cuando:", opts: ["Logramos una meta rápido", "Un obstáculo interrumpe un deseo", "No tenemos expectativas"], correct: 1 },
  { q: "El ejercicio físico ayuda a la salud mental porque:", opts: ["Elimina neuronas dañadas", "Libera endorfinas y serotonina", "No influye en el cerebro"], correct: 1 },
  { q: "Establecer límites asertivos sirve para:", opts: ["Castigar a tus seres queridos", "Proteger tu espacio y energía", "Demostrar superioridad"], correct: 1 },
  { q: "El sesgo de negatividad nos empuja a:", opts: ["Dar más peso a lo malo que a lo bueno", "Ver la vida perfecta siempre", "Tomar decisiones ideales"], correct: 0 },
  { q: "La autocompasión consiste en:", opts: ["Tratarse con amor en el fracaso", "Sentirse una víctima indefensa", "Justificar malas acciones"], correct: 0 },
  { q: "Para organizar tu tiempo y bajar el estrés conviene:", opts: ["Hacer multitarea masiva", "Dividir deberes en pasos chicos", "Dejar todo para el final"], correct: 1 },
  { q: "¿Qué elemento daña una relación de pareja sana?", opts: ["La comunicación abierta", "Controlar contraseñas y amigos", "Apoyar las metas del otro"], correct: 1 },
  { q: "El llanto cumple la función biológica de:", opts: ["Indicar debilidad inmunológica", "Liberar estrés y calmar el cuerpo", "Manipular el entorno social"], correct: 1 },
  { q: "La empatía cognitiva consiste en:", opts: ["Sentir el dolor físico del otro", "Entender intelectualmente al otro", "Cargar con culpas ajenas"], correct: 1 },
  { q: "Un factor protector de la salud mental juvenil es:", opts: ["Canales de diálogo en casa y escuela", "El aislamiento en la habitación", "Evitar cualquier conversación"], correct: 0 },
  { q: "Invertir tiempo en tus hobbies favoritos es:", opts: ["Una pérdida de tiempo total", "Una inversión en tu bienestar", "Algo exclusivo de vacaciones"], correct: 1 }
];

// Algoritmo Fisher-Yates para mezclar las preguntas
function shuffle(array: typeof ALL_QUESTIONS) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function Trivia() {
  const { user } = useSession(); 
  const { profile } = useProfile(user?.id);
  const [i, setI] = useState(0); 
  const [score, setScore] = useState(0); 
  const [done, setDone] = useState(false);
  
  // Guardará el subconjunto de 10 preguntas seleccionadas para la partida actual
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof ALL_QUESTIONS>([]);
  const [xpAwarded, setXPAwarded] = useState(0);

  // Mezclar y elegir 10 preguntas al cargar el componente por primera vez
  useEffect(() => {
    setShuffledQuestions(shuffle(ALL_QUESTIONS).slice(0, 10));
  }, []);

  async function answer(idx: number) {
    const isCorrect = idx === shuffledQuestions[i].correct;
    const currentScore = score + (isCorrect ? 1 : 0);

    if (isCorrect) setScore((s) => s + 1);
    
    if (i + 1 < shuffledQuestions.length) {
      setI(i + 1);
    } else {
      setDone(true);
      if (user && profile) {
        const xp = currentScore * 5;
        setXPAwarded(xp);
        await supabase.from("game_sessions").insert({ 
          user_id: user.id, 
          game_key: "trivia", 
          score: currentScore, 
          xp_earned: xp 
        });
        await supabase.from("profiles").update({ xp: profile.xp + xp }).eq("id", user.id);
        toast.success(`+${xp} XP`);
      }
    }
  }

  function reset() { 
    setI(0); 
    setScore(0); 
    setDone(false); 
    setXPAwarded(0);
    // Vuelve a mezclar el banco completo y toma 10 preguntas diferentes
    setShuffledQuestions(shuffle(ALL_QUESTIONS).slice(0, 10));
  }

  // Renderizado defensivo mientras se inicializan las preguntas
  if (shuffledQuestions.length === 0) return null;

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/app/juegos" className="text-xs text-muted-foreground">← Volver</Link>
      <h1 className="mt-1 text-3xl font-extrabold">Trivia de bienestar</h1>
      {!done ? (
        <div className="card-soft p-6 mt-4">
          <div className="text-xs text-primary font-bold">Pregunta {i + 1} de {shuffledQuestions.length}</div>
          <div className="mt-2 font-bold text-lg">{shuffledQuestions[i].q}</div>
          <div className="mt-4 space-y-2">
            {shuffledQuestions[i].opts.map((o, idx) => (
              <button key={idx} onClick={() => answer(idx)} className="w-full text-left rounded-2xl border p-3 hover:bg-secondary">{o}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="card-soft p-8 text-center mt-4">
          <div className="text-5xl">🎉</div>
          <div className="text-2xl font-extrabold mt-2">¡Acertaste {score}/{shuffledQuestions.length}!</div>
          {xpAwarded > 0 && <div className="text-sm font-semibold text-primary mt-1">+{xpAwarded} XP Ganados</div>}
          <button onClick={reset} className="mt-4 rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold">Volver a jugar</button>
        </div>
      )}
    </div>
  );
}

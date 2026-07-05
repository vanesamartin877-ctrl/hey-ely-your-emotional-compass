
CREATE TYPE public.app_role AS ENUM ('admin', 'student', 'natural');
CREATE TYPE public.user_type AS ENUM ('admin', 'student', 'natural');
CREATE TYPE public.alert_status AS ENUM ('pending', 'in_progress', 'attended', 'closed');
CREATE TYPE public.mission_frequency AS ENUM ('daily', 'weekly', 'monthly');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  department TEXT NOT NULL,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX institutions_unique_name_location ON public.institutions (lower(name), lower(city), lower(department));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.institutions TO authenticated;
GRANT SELECT ON public.institutions TO anon;
GRANT ALL ON public.institutions TO service_role;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can browse institutions" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "Admin insert own institution" ON public.institutions FOR INSERT TO authenticated WITH CHECK (auth.uid() = admin_user_id);
CREATE POLICY "Admin update own institution" ON public.institutions FOR UPDATE TO authenticated USING (auth.uid() = admin_user_id);
CREATE POLICY "Admin delete own institution" ON public.institutions FOR DELETE TO authenticated USING (auth.uid() = admin_user_id);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  user_type user_type NOT NULL,
  email TEXT,
  age INTEGER,
  grade TEXT,
  course TEXT,
  position TEXT,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins read profiles of their institution" ON public.profiles FOR SELECT TO authenticated
  USING (institution_id IN (SELECT id FROM public.institutions WHERE admin_user_id = auth.uid()));
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.avatars (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  unlocked_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.avatars TO authenticated;
GRANT ALL ON public.avatars TO service_role;
ALTER TABLE public.avatars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own avatar" ON public.avatars FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.pets (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  active_pet TEXT NOT NULL DEFAULT 'ely',
  unlocked_pets JSONB NOT NULL DEFAULT '["ely"]'::jsonb,
  accessories JSONB NOT NULL DEFAULT '[]'::jsonb,
  pet_level INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.pets TO authenticated;
GRANT ALL ON public.pets TO service_role;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own pet" ON public.pets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  frequency mission_frequency NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  category TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.missions TO authenticated, anon;
GRANT ALL ON public.missions TO service_role;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active missions" ON public.missions FOR SELECT USING (active = true);

CREATE TABLE public.mission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  period_key TEXT NOT NULL,
  UNIQUE(user_id, mission_id, period_key)
);
GRANT SELECT, INSERT ON public.mission_progress TO authenticated;
GRANT ALL ON public.mission_progress TO service_role;
ALTER TABLE public.mission_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own mission progress" ON public.mission_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_key TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  played_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX game_sessions_user_idx ON public.game_sessions(user_id);
GRANT SELECT, INSERT ON public.game_sessions TO authenticated;
GRANT ALL ON public.game_sessions TO service_role;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own game sessions" ON public.game_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins see games of their students" ON public.game_sessions FOR SELECT TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE institution_id IN (SELECT id FROM public.institutions WHERE admin_user_id = auth.uid())));

CREATE TABLE public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.surveys TO authenticated;
GRANT ALL ON public.surveys TO service_role;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own surveys" ON public.surveys FOR ALL TO authenticated
  USING (admin_user_id = auth.uid()) WITH CHECK (admin_user_id = auth.uid());
CREATE POLICY "Students see published surveys of institution" ON public.surveys FOR SELECT TO authenticated
  USING (published = true AND institution_id IN (SELECT institution_id FROM public.profiles WHERE id = auth.uid()));

CREATE TABLE public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(survey_id, user_id)
);
GRANT SELECT, INSERT ON public.survey_responses TO authenticated;
GRANT ALL ON public.survey_responses TO service_role;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own responses" ON public.survey_responses FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins see responses of own surveys" ON public.survey_responses FOR SELECT TO authenticated
  USING (survey_id IN (SELECT id FROM public.surveys WHERE admin_user_id = auth.uid()));

CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_url TEXT,
  content_body TEXT,
  cover_emoji TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.resources TO authenticated, anon;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads resources" ON public.resources FOR SELECT USING (true);

CREATE TABLE public.resource_favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, resource_id)
);
GRANT SELECT, INSERT, DELETE ON public.resource_favorites TO authenticated;
GRANT ALL ON public.resource_favorites TO service_role;
ALTER TABLE public.resource_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own favorites" ON public.resource_favorites FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news TO authenticated;
GRANT ALL ON public.news TO service_role;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own news" ON public.news FOR ALL TO authenticated USING (admin_user_id = auth.uid()) WITH CHECK (admin_user_id = auth.uid());
CREATE POLICY "Students see news of their institution" ON public.news FOR SELECT TO authenticated
  USING (published = true AND institution_id IN (SELECT institution_id FROM public.profiles WHERE id = auth.uid()));

CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  risk_level TEXT NOT NULL,
  category TEXT NOT NULL,
  status alert_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.alerts TO authenticated;
GRANT ALL ON public.alerts TO service_role;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students create own alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (student_user_id = auth.uid());
CREATE POLICY "Admins read alerts of their institution" ON public.alerts FOR SELECT TO authenticated
  USING (institution_id IN (SELECT id FROM public.institutions WHERE admin_user_id = auth.uid()));
CREATE POLICY "Admins update alerts of their institution" ON public.alerts FOR UPDATE TO authenticated
  USING (institution_id IN (SELECT id FROM public.institutions WHERE admin_user_id = auth.uid()));
CREATE TRIGGER alerts_touch BEFORE UPDATE ON public.alerts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX chat_messages_user_idx ON public.chat_messages(user_id, created_at);
GRANT SELECT, INSERT, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only owner reads chat" ON public.chat_messages FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Only owner writes chat" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Only owner deletes chat" ON public.chat_messages FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  utype user_type;
  urole app_role;
BEGIN
  utype := COALESCE((NEW.raw_user_meta_data->>'user_type')::user_type, 'natural');
  urole := CASE utype WHEN 'admin' THEN 'admin'::app_role WHEN 'student' THEN 'student'::app_role ELSE 'natural'::app_role END;

  INSERT INTO public.profiles (id, full_name, user_type, email, age, grade, course, position)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    utype,
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'age','')::INTEGER,
    NEW.raw_user_meta_data->>'grade',
    NEW.raw_user_meta_data->>'course',
    NEW.raw_user_meta_data->>'position'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, urole) ON CONFLICT DO NOTHING;
  INSERT INTO public.avatars (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  INSERT INTO public.pets (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.missions (title, description, frequency, xp_reward, category) VALUES
('Salúdame hoy', 'Habla con Ely al menos una vez hoy', 'daily', 10, 'chat'),
('Lee un recurso', 'Consulta un artículo o video de la biblioteca', 'daily', 15, 'resources'),
('Juega para relajarte', 'Completa un juego de bienestar', 'daily', 20, 'games'),
('Respira profundo', 'Realiza el ejercicio de respiración', 'daily', 10, 'wellness'),
('Identifica tus emociones', 'Nombra cómo te sientes hoy', 'daily', 15, 'emotions'),
('Racha semanal', 'Ingresa 5 días en la semana', 'weekly', 50, 'streak'),
('Reto mensual', 'Completa 20 misiones diarias', 'monthly', 200, 'streak');

INSERT INTO public.resources (title, description, category, content_type, content_body, cover_emoji) VALUES
('¿Qué es la ansiedad?', 'Aprende a reconocer y manejar la ansiedad.', 'Ansiedad', 'article', 'La ansiedad es una respuesta natural ante situaciones que percibimos como amenazantes. Estrategias útiles: respiración diafragmática, movimiento suave, hablar con alguien de confianza, y limitar redes sociales.', '🌿'),
('Cuidando tu autoestima', 'Ideas prácticas para hablarte con más amabilidad.', 'Autoestima', 'article', 'Escribe tres cosas que hiciste bien hoy, evita compararte en redes, celebra pequeños logros y ponle límites a la autocrítica.', '💜'),
('Reconoce el bullying', 'Cómo identificar y qué hacer.', 'Bullying', 'article', 'Cuéntalo a un adulto de confianza, guarda evidencias si es ciberbullying y recuerda que no estás solo/a.', '🛡️'),
('Manejo del estrés escolar', 'Herramientas para momentos de mucha carga.', 'Estrés', 'article', 'Divide tareas en pasos pequeños, descansa 5 min cada 25, duerme 7-9 horas, hidrátate y muévete.', '📚'),
('Regulación emocional: STOP', 'Técnica para pausar antes de reaccionar.', 'Regulación', 'article', 'S — Stop. T — Toma aire. O — Observa. P — Procede con calma.', '🌊'),
('Habilidades sociales', 'Consejos para conectar.', 'Habilidades', 'article', 'Escucha antes de responder, haz preguntas abiertas, valida lo que siente la otra persona.', '🤝'),
('Proyecto de vida', 'Diseña el futuro que quieres.', 'Proyecto de vida', 'article', 'Escribe tres pasiones, tres cosas que quieres aprender y tres personas que te inspiran.', '🌟'),
('Ciberbullying: qué hacer', 'Guía para protegerte en línea.', 'Ciberbullying', 'article', 'No respondas al agresor. Bloquea y reporta. Guarda capturas. Cuéntalo.', '📱');

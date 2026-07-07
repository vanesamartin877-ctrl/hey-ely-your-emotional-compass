
-- 1) institutions: restrict SELECT to authenticated users
DROP POLICY IF EXISTS "Anyone can browse institutions" ON public.institutions;
CREATE POLICY "Authenticated can browse institutions"
  ON public.institutions FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.institutions FROM anon;

-- 2) user_roles: explicit deny on write for authenticated (no policy => denied, but make it explicit and safe)
CREATE POLICY "No self role insert"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (false);
CREATE POLICY "No self role update"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (false)
  WITH CHECK (false);
CREATE POLICY "No self role delete"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (false);

-- 3) has_role: revoke direct execute from clients (still usable inside SECURITY DEFINER policies/functions owned by postgres)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

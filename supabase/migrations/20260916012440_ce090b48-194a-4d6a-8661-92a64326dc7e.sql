CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.current_nucleo_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT nucleo_id FROM public.perfis WHERE user_id = auth.uid() AND ativo = true
$$;
REVOKE ALL ON FUNCTION private.current_nucleo_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.current_nucleo_id() TO authenticated, service_role;

DROP POLICY "Users can view their own profile and nucleus team" ON public.perfis;
CREATE POLICY "Users can view their own profile and nucleus team"
ON public.perfis FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR (nucleo_id IS NOT NULL AND nucleo_id = private.current_nucleo_id())
  OR private.has_role(auth.uid(), 'COORDENACAO')
);

DROP POLICY "Nucleus members can view collective activities" ON public.atividades_conectores;
DROP POLICY "Connectors can create their own nucleus activities" ON public.atividades_conectores;
DROP POLICY "Connectors can update their own activities" ON public.atividades_conectores;
CREATE POLICY "Nucleus members can view collective activities"
ON public.atividades_conectores FOR SELECT TO authenticated
USING (nucleo_id = private.current_nucleo_id() OR private.has_role(auth.uid(), 'COORDENACAO'));
CREATE POLICY "Connectors can create their own nucleus activities"
ON public.atividades_conectores FOR INSERT TO authenticated
WITH CHECK (conector_id = auth.uid() AND nucleo_id = private.current_nucleo_id() AND private.has_role(auth.uid(), 'CONECTOR'));
CREATE POLICY "Connectors can update their own activities"
ON public.atividades_conectores FOR UPDATE TO authenticated
USING (conector_id = auth.uid()) WITH CHECK (conector_id = auth.uid() AND nucleo_id = private.current_nucleo_id());

CREATE POLICY "Authorized access list is private"
ON public.conectores_autorizados FOR SELECT TO authenticated USING (false);

DROP FUNCTION public.current_nucleo_id();
DROP FUNCTION public.has_role(uuid, public.app_role);
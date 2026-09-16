CREATE TYPE public.app_role AS ENUM ('CONECTOR', 'COORDENACAO');

CREATE TABLE public.nucleos_territoriais (
  id text PRIMARY KEY,
  nome text NOT NULL UNIQUE,
  demonstrativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nucleos_territoriais TO authenticated;
GRANT ALL ON public.nucleos_territoriais TO service_role;
ALTER TABLE public.nucleos_territoriais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view territorial nuclei"
ON public.nucleos_territoriais FOR SELECT TO authenticated USING (true);

CREATE TABLE public.perfis (
  user_id uuid PRIMARY KEY,
  nome text NOT NULL,
  email text NOT NULL UNIQUE,
  nucleo_id text REFERENCES public.nucleos_territoriais(id),
  ativo boolean NOT NULL DEFAULT true,
  demonstrativo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.perfis TO authenticated;
GRANT ALL ON public.perfis TO service_role;
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
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
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

CREATE OR REPLACE FUNCTION public.current_nucleo_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT nucleo_id FROM public.perfis WHERE user_id = auth.uid() AND ativo = true
$$;
GRANT EXECUTE ON FUNCTION public.current_nucleo_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_nucleo_id() TO service_role;

CREATE POLICY "Users can view their own profile and nucleus team"
ON public.perfis FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR (nucleo_id IS NOT NULL AND nucleo_id = public.current_nucleo_id())
  OR public.has_role(auth.uid(), 'COORDENACAO')
);
CREATE POLICY "Users can update their own profile"
ON public.perfis FOR UPDATE TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.conectores_autorizados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL UNIQUE,
  nucleo_id text REFERENCES public.nucleos_territoriais(id),
  role public.app_role NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  demonstrativo boolean NOT NULL DEFAULT true,
  claimed_by uuid UNIQUE,
  claimed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.conectores_autorizados TO service_role;
ALTER TABLE public.conectores_autorizados ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.atividades_conectores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conector_id uuid NOT NULL,
  nucleo_id text NOT NULL REFERENCES public.nucleos_territoriais(id),
  tipo_id text NOT NULL,
  missao_id text,
  data date NOT NULL,
  municipio text NOT NULL DEFAULT '',
  local text NOT NULL DEFAULT '',
  titulo text NOT NULL,
  descricao text NOT NULL,
  atores text NOT NULL DEFAULT '',
  resultados text NOT NULL DEFAULT '',
  observacoes text NOT NULL DEFAULT '',
  localizacao text NOT NULL DEFAULT '',
  evidencia_foto text,
  evidencia_documento text,
  evidencia_link text,
  fonte_contribuicao text,
  missoes_relacionadas text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'em_validacao' CHECK (status IN ('rascunho','enviada','em_validacao','aprovada','ajustes_solicitados')),
  demonstrativo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.atividades_conectores TO authenticated;
GRANT ALL ON public.atividades_conectores TO service_role;
ALTER TABLE public.atividades_conectores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Nucleus members can view collective activities"
ON public.atividades_conectores FOR SELECT TO authenticated
USING (nucleo_id = public.current_nucleo_id() OR public.has_role(auth.uid(), 'COORDENACAO'));
CREATE POLICY "Connectors can create their own nucleus activities"
ON public.atividades_conectores FOR INSERT TO authenticated
WITH CHECK (conector_id = auth.uid() AND nucleo_id = public.current_nucleo_id() AND public.has_role(auth.uid(), 'CONECTOR'));
CREATE POLICY "Connectors can update their own activities"
ON public.atividades_conectores FOR UPDATE TO authenticated
USING (conector_id = auth.uid()) WITH CHECK (conector_id = auth.uid() AND nucleo_id = public.current_nucleo_id());
CREATE POLICY "Connectors can delete their own activities"
ON public.atividades_conectores FOR DELETE TO authenticated USING (conector_id = auth.uid());

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER set_nucleos_updated_at BEFORE UPDATE ON public.nucleos_territoriais FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_perfis_updated_at BEFORE UPDATE ON public.perfis FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_autorizados_updated_at BEFORE UPDATE ON public.conectores_autorizados FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_atividades_updated_at BEFORE UPDATE ON public.atividades_conectores FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.nucleos_territoriais (id, nome) VALUES
('vitoria', 'Vitória'),
('vila-velha', 'Vila Velha'),
('serra', 'Serra'),
('cariacica', 'Cariacica'),
('viana-fundao-guarapari', 'Viana, Fundão e Guarapari'),
('central-serrana', 'Central Serrana'),
('sudoeste-serrana', 'Sudoeste Serrana'),
('litoral-sul', 'Litoral Sul'),
('centro-sul', 'Centro Sul'),
('caparao', 'Caparaó'),
('rio-doce', 'Rio Doce'),
('centro-oeste', 'Centro-Oeste'),
('nordeste', 'Nordeste'),
('noroeste', 'Noroeste');

INSERT INTO public.conectores_autorizados (nome, email, nucleo_id, role, demonstrativo) VALUES
('Conector Teste 01', 'conector.teste01@caminhos.demo', 'serra', 'CONECTOR', true),
('Conector Teste 02', 'conector.teste02@caminhos.demo', 'serra', 'CONECTOR', true),
('Coordenação Teste', 'coordenacao.teste@caminhos.demo', NULL, 'COORDENACAO', true);
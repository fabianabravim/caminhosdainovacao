CREATE OR REPLACE FUNCTION public.proteger_campos_perfil()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND (
    NEW.user_id IS DISTINCT FROM OLD.user_id OR
    NEW.email IS DISTINCT FROM OLD.email OR
    NEW.nucleo_id IS DISTINCT FROM OLD.nucleo_id OR
    NEW.ativo IS DISTINCT FROM OLD.ativo OR
    NEW.demonstrativo IS DISTINCT FROM OLD.demonstrativo
  ) THEN
    RAISE EXCEPTION 'Campos administrativos do perfil só podem ser alterados pela Administração.';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER proteger_campos_perfil BEFORE UPDATE ON public.perfis
FOR EACH ROW EXECUTE FUNCTION public.proteger_campos_perfil();
UPDATE public.conectores_autorizados
SET email = CASE nome
  WHEN 'Conector Teste 01' THEN 'fabianabravim@gmail.com'
  WHEN 'Conector Teste 02' THEN 'fabiana.freitas@uvv.br'
  WHEN 'Coordenação Teste' THEN 'maryanadefreitaspaulino@gmail.com'
END
WHERE demonstrativo = true
  AND nome IN ('Conector Teste 01', 'Conector Teste 02', 'Coordenação Teste');
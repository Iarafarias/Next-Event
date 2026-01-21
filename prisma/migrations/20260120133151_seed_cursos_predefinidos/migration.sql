-- Inserção dos cursos pré-definidos
INSERT INTO "curso" (id, nome, codigo, descricao, "criadoEm", ativo, "atualizadoEm") VALUES
  (gen_random_uuid(), 'Sistemas de Informação', 'SI', 'Curso de Sistemas de Informação', NOW(), true, NOW()),
  (gen_random_uuid(), 'Ciências da Computação', 'CC', 'Curso de Ciências da Computação', NOW(), true, NOW()),
  (gen_random_uuid(), 'Engenharia Ambiental e Sanitária', 'EAS', 'Curso de Engenharia Ambiental e Sanitária', NOW(), true, NOW()),
  (gen_random_uuid(), 'Engenharia Civil', 'EC', 'Curso de Engenharia Civil', NOW(), true, NOW()),
  (gen_random_uuid(), 'Engenharia de Minas', 'EM', 'Curso de Engenharia de Minas', NOW(), true, NOW())
ON CONFLICT (codigo) DO NOTHING;

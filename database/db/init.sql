CREATE TABLE IF NOT EXISTS cadastro_usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo_usuario VARCHAR(20) NOT NULL DEFAULT 'usuario_participante',
  matricula VARCHAR(6) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS eventos (
  id_evento SERIAL PRIMARY KEY,
  nome_evento VARCHAR(100) NOT NULL,
  data TIMESTAMP NOT NULL,
  descricao TEXT
);

CREATE TABLE IF NOT EXISTS inscricao (
  id_inscricao SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES cadastro_usuarios(id_usuario),
  id_evento INTEGER REFERENCES eventos(id_evento),
  data_presenca TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS autenticacao (
  id_autenticacao SERIAL PRIMARY KEY,
  id_inscricao INTEGER REFERENCES inscricao(id_inscricao),
  data_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  qrcode TEXT,
  pin_code VARCHAR(6) NOT NULL
);

CREATE TABLE IF NOT EXISTS certificados (
  id_certificado SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES cadastro_usuarios(id_usuario),
  id_evento INTEGER REFERENCES eventos(id_evento),
  id_inscricao INTEGER REFERENCES inscricao(id_inscricao),
  url_certificado TEXT
);
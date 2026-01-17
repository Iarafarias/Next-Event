# Use Node.js 18 LTS como base
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./
COPY prisma/ ./prisma/

# Instalar dependências
RUN npm ci --only=production --legacy-peer-deps

# Instalar Prisma CLI globalmente
RUN npm install -g prisma

# Copiar código da aplicação
COPY . .

# Gerar o Prisma Client
RUN npx prisma generate

# Criar diretório para uploads
RUN mkdir -p uploads/certificates

# Criar usuário não-root para segurança (Desativado temporariamente para resolver permissões em dev)
# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nodejs -u 1001
# RUN chown -R nodejs:nodejs /app
# USER nodejs

# Expor porta da aplicação
EXPOSE 3000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
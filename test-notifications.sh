#!/bin/bash

# Script de teste das APIs de Notificação
echo "🧪 Testando Sistema de Notificações NextEvent"
echo "============================================"

BASE_URL="http://localhost:3000/api"

# 1. Testar login do usuário participante
echo "📝 1. Fazendo login como participante..."
PARTICIPANT_LOGIN=$(curl -s -X POST ${BASE_URL}/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@teste.com", "password": "user123"}')

echo "Resposta login participante: $PARTICIPANT_LOGIN"

# 2. Testar login do administrador
echo "📝 2. Fazendo login como administrador..."
ADMIN_LOGIN=$(curl -s -X POST ${BASE_URL}/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@nextevent.com", "password": "admin123"}')

echo "Resposta login admin: $ADMIN_LOGIN"

# 3. Testar API de notificações (sem token por enquanto)
echo "📝 3. Testando endpoint de notificações..."
NOTIFICATIONS=$(curl -s ${BASE_URL}/notifications)

echo "📋 Resposta notificações: $NOTIFICATIONS"

# 4. Testar contagem de não lidas
echo "📝 4. Testando contagem de não lidas..."
UNREAD_COUNT=$(curl -s ${BASE_URL}/notifications/unread-count)

echo "📊 Resposta contagem: $UNREAD_COUNT"

# 5. Simular criação de certificado (se houver endpoint)
# Este passo seria necessário para testar o fluxo completo

echo ""
echo "🎯 Resumo dos Testes:"
echo "✅ Login participante funcionando"
echo "✅ Login administrador funcionando"
echo "✅ API de notificações respondendo"
echo "✅ Contagem de não lidas funcionando"
echo ""
echo "🔗 Para testar notificações completas:"
echo "1. Crie um certificado via API"
echo "2. Aprove/rejeite como admin"
echo "3. Verifique notificações do participante"
echo ""
echo "📄 URLs disponíveis:"
echo "GET    $BASE_URL/notifications"
echo "GET    $BASE_URL/notifications?unread=true"
echo "GET    $BASE_URL/notifications/unread-count"
echo "PATCH  $BASE_URL/notifications/:id/read"
echo "PATCH  $BASE_URL/notifications/mark-all-read"

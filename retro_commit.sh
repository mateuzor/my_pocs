#!/bin/bash

# Exemplo de uso:
# ./retro_commit.sh "Minha mensagem" "2024-04-09 15:30"

# Mensagem de commit
COMMIT_MSG=${1:-"Commit retroativo de ontem"}

# Data customizada (se não passar, usa ontem às 10:00)
CUSTOM_DATE=${2:-"yesterday 10:00"}

# Converte para o formato correto (ISO 8601)
FORMATTED_DATE=$(date -d "$CUSTOM_DATE" +"%Y-%m-%dT%H:%M:%S")

# Mostra a data usada (para debug)
echo "Usando data: $FORMATTED_DATE"
echo "Mensagem: $COMMIT_MSG"

# Executa o commit com data retroativa
git add .
GIT_AUTHOR_DATE="$FORMATTED_DATE" GIT_COMMITTER_DATE="$FORMATTED_DATE" git commit -m "$COMMIT_MSG"
git push origin $(git rev-parse --abbrev-ref HEAD)

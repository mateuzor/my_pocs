#!/bin/bash

# Mensagem padrão de commit (pode mudar aqui ou passar como argumento)
COMMIT_MSG=${1:-"Commit retroativo de ontem"}

# Data de ontem no formato correto
YESTERDAY=$(date -d "yesterday" +"%Y-%m-%dT12:00:00")

# Adiciona as alterações, faz o commit com data de ontem e faz o push
git add .
GIT_AUTHOR_DATE="$YESTERDAY" GIT_COMMITTER_DATE="$YESTERDAY" git commit -m "$COMMIT_MSG"
git push origin $(git rev-parse --abbrev-ref HEAD)

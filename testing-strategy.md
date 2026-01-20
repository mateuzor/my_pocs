## 🗣️ ROTEIRO

### **[1-2 min] PRINCÍPIOS - O que guia nossos testes**

**[Mostrar seção 8.1 do doc]**

"Antes de falar dos tipos de teste, os **7 princípios** que vão guiar tudo:

1. **Shift-Left Testing** - Teste começa no design, não depois que o código tá pronto
2. **Pirâmide de Testes** - Muitos unitários (rápidos), menos integração, poucos E2E
3. **Production-like** - Staging é cópia de produção (mesmas regiões AWS, mesmo setup)
4. **Chaos Engineering** - Vamos quebrar coisas de propósito (derrubar AZ, forçar failover) pra garantir que o sistema se recupera
5. **Performance Contínuo** - Load tests toda semana, não só antes do go-live
6. **Isolamento de Dados** - Cada teste usa dados próprios (zero conflito)
7. **Observability-Driven** - Testes validam métricas/logs também, não só código

O mais polêmico é o número 4 - chaos engineering. Eu sei que parece loucura derrubar servidor de propósito, mas empresas como Netflix fazem isso há anos. Prefiro descobrir que o failover não funciona numa terça de manhã do que durante o show ao vivo."

---

### **[2-4 min] TIPOS DE TESTES - Visão Geral**

**[Mostrar seção 8.2 do doc]**

"Vamos ter **5 tipos principais** de testes. Deixa eu passar rápido por cada um:

**1. Testes Unitários (70% coverage mínimo)**

- JUnit 5 + Mockito + AssertJ
- Foco: lógica de negócio (detecção de voto duplicado, validações)
- Tudo mockado (sem DB, sem rede)
- Rodam em **todo commit**, <2 minutos
- Exemplo crítico: testar que voto duplicado é rejeitado

**2. Testes de Integração (Testcontainers)**

- Sobe PostgreSQL, Redis, SQS em containers Docker temporários
- Foco: validar que serviços conversam corretamente
- Testa persistência real, cache, filas
- Rodam no **merge para main**, <10 minutos
- Pegam bugs que mocks não pegam (índices faltando, queries lentas)

**3. Testes de Contrato (Spring Cloud Contract)**

- Valida que API frontend ↔ backend não quebra
- Garante backward compatibility
- Rodam em **toda mudança de API**

**4. Testes End-to-End (Cypress)**

- Apenas fluxos críticos (registro → login → voto → resultado)
- Rodam **nightly** em staging
- Lentos (~30 min), então usamos com moderação

**5. Testes de Performance (k6, JMeter)**

- Aqui é o coração da estratégia pra esse projeto
- Vou detalhar mais..."

---

### **[4-6 min] PERFORMANCE & CARGA - O mais crítico**

**[Mostrar seção 8.3 do doc]**

"Testes de performance são **mandatórios** nesse projeto. Vamos simular 4 cenários:

**Cenário 1: Baseline (50k RPS)** - carga normal, p99 <100ms
**Cenário 2: Peak (250k RPS)** - pico do show, p99 <150ms
**Cenário 3: Sustained (100k RPS por 2 horas)** - detectar memory leaks
**Cenário 4: Traffic Spike (0→150k em 30s)** - quando o apresentador grita 'VOTEM!'

Usamos k6 com scripts em JavaScript. Exemplo:

```javascript
thresholds: {
  http_req_duration: ['p(99)<150'],  // 99% <150ms
  http_req_failed: ['rate<0.01'],    // <0.01% erro
}
```

Se violar esses thresholds, **build quebra**. Não é warning, é falha hard.

**Dados de teste:** 1M usuários sintéticos, 100k JWT tokens pré-gerados
**Onde roda:** Staging com setup idêntico a produção (3 regiões AWS)
**Quando:** Automático toda semana (domingo 2h AM) + manual antes de releases

**Importante:** Se performance test falhar, **não deployamos**. Performance não é negociável nesse sistema."

---

### **[6-8 min] CHAOS ENGINEERING - Quebrando de propósito**

**[Mostrar seção 8.4 do doc]**

"Aqui é onde a gente testa se o sistema realmente aguenta falhas. Vamos usar **AWS Fault Injection Simulator** pra simular:

**Experimentos que vamos rodar:**

| O que fazemos               | Resultado esperado                                 | Frequência          |
| --------------------------- | -------------------------------------------------- | ------------------- |
| Derrubar AZ inteira         | Tráfego vai pra outras AZs, <5s downtime           | Semanal (terça 10h) |
| Forçar failover do RDS      | Votos ficam na fila SQS, processam depois          | Quinzenal           |
| Matar 1 nó do Redis         | Cluster rebalancea, cache hit cai 20% mas sem erro | Mensal              |
| Isolar rede do Vote Service | Votos vão pra DLQ, processam após recovery         | Mensal              |

**Chaos Goals (critérios de sucesso):**

1. ✅ **Zero Vote Loss** - todo voto na SQS chega no banco
2. ✅ **Graceful Degradation** - sistema fica lento, mas não crasha
3. ✅ **Auto-Recovery** - sem intervenção manual
4. ✅ **Alertas corretos** - disparam em <60s

Se qualquer goal não for atingido, temos problema de arquitetura.

**Importante:** Chaos só roda em **staging** (não em produção, pelo menos no início). Horários agendados, time de prontidão."

---

### **[8-9 min] ESTRATÉGIA DE DADOS & RESPONSABILIDADES**

**[Mostrar seções 8.6 e 8.9 do doc]**

"**Dados de teste:**

- 10M usuários sintéticos (Faker.js)
- 100 eleições pré-configuradas
- 500M votos históricos (seeded via batch)
- **Zero dados reais** (GDPR/LGPD compliant)

**Quem faz o quê:**

| Papel          | Responsabilidade                                           |
| -------------- | ---------------------------------------------------------- |
| **Devs**       | Testes unitários + integração (mesma sprint da feature)    |
| **QA**         | E2E tests, executar chaos experiments                      |
| **DevOps**     | Infra de testes, pipelines CI/CD, load tests               |
| **Todo mundo** | Code review de testes, ninguém é dono sozinho da qualidade |

**Definition of Done mudou:**

- Feature **não está pronta** sem testes
- PR sem testes **não passa no review**
- Coverage <70% **quebra o build**"

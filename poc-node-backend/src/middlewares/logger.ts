import { randomUUID } from 'node:crypto';
import pinoHttp from 'pino-http';
import { logger } from '../logger.js';

// Aula 5 — Middleware extraído pra arquivo próprio. Só o log.
// Aula 9 — trocado console.log por pino-http (JSON estruturado).
//
// O ganho que não é óbvio: REQUEST ID.
//
// Sem ele, quando um usuário reclama de um erro às 14h32, você tem centenas de
// linhas soltas e nenhuma forma de saber quais pertencem à MESMA request.
// Com um id por request, o log vira rastreável: filtra por `req.id` e você vê
// a request inteira, de ponta a ponta.
//
// O id vem do header `x-request-id` quando existe — assim, num sistema com
// vários serviços, o mesmo id atravessa todos e dá pra seguir a request pela
// stack toda. É a base de tracing distribuído.

export const requestLogger = pinoHttp({
  logger,

  genReqId(req, res) {
    const fromUpstream = req.headers['x-request-id'];
    const id = (Array.isArray(fromUpstream) ? fromUpstream[0] : fromUpstream) ?? randomUUID();
    // Devolve no response pro cliente conseguir citar o id ao reportar o bug
    res.setHeader('x-request-id', id);
    return id;
  },

  // Nível por faixa de status: 5xx é erro nosso, 4xx é erro do cliente
  // (esperado — não deve acordar ninguém de madrugada), o resto é info.
  customLogLevel(_req, res, err) {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },

  // Sem isto, pino serializa o objeto Request inteiro do Node — dezenas de
  // campos internos por linha de log. Escolhemos o que interessa.
  serializers: {
    req: (req) => ({ id: req.id, method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
});

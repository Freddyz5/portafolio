/*
  Comando de humo (oculto) para ejercitar el motor de tareas contra la terminal
  real: spinner, barra, y una línea de error anunciada. No aparece en `help` ni
  en autocompletado. `install` (PASO/FASE 3) es el consumidor de verdad.
*/

import type { Command } from '../core/registry';
import { ok, seg } from '../core/output';
import { runTask } from '../tasks/runner';
import type { TaskScript } from '../tasks/script';

export const demo: Command = {
  name: '__demo',
  summary: { es: '', en: '' },
  hidden: true,
  run: async (_input, ctx) => {
    const script: TaskScript = {
      steps: [
        { kind: 'print', line: [seg('DEMO iniciando motor de tareas', 'dim')] },
        { kind: 'spinner', label: [seg('RESOLVE  resolviendo demo', 'accent')], ms: 500 },
        { kind: 'progress', label: [seg('FETCH    descargando', 'data')], ms: 900 },
        { kind: 'spinner', label: [seg('VERIFY   verificando integridad', 'accent')], ms: 400 },
        { kind: 'fail', line: [seg('ERROR    demo: interrupción esperada', 'alert')] },
      ],
    };
    await runTask(script, ctx.effects.task, ctx.effects.taskSignal());
    return ok([]);
  },
};

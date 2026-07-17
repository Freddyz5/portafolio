// Persistencia del lab, tolerante a modo privado / localStorage bloqueado.

const INPUT_KEY = 'cv-lab-input';
const VIEW_KEY = 'cv-lab-view';

export type LabView = 'cv' | 'ats';

export const labStore = {
  getInput(): string | null {
    try {
      return localStorage.getItem(INPUT_KEY);
    } catch {
      return null;
    }
  },
  setInput(value: string): void {
    try {
      localStorage.setItem(INPUT_KEY, value);
    } catch {
      /* noop */
    }
  },
  removeInput(): void {
    try {
      localStorage.removeItem(INPUT_KEY);
    } catch {
      /* noop */
    }
  },
  getView(): LabView {
    try {
      return localStorage.getItem(VIEW_KEY) === 'ats' ? 'ats' : 'cv';
    } catch {
      return 'cv';
    }
  },
  setView(view: LabView): void {
    try {
      localStorage.setItem(VIEW_KEY, view);
    } catch {
      /* noop */
    }
  },
};

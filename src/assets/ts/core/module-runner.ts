export type CleanupFn = () => void;
export type ModuleDefinition = {
  id: string;
  init: () => void | CleanupFn | Promise<void | CleanupFn>;
};

const initializedModules = new Set<string>();
const cleanupByModuleId = new Map<string, CleanupFn>();

export const initializeModules = async (
  modules: ModuleDefinition[],
): Promise<void> => {
  for (const module of modules) {
    if (initializedModules.has(module.id)) {
      continue;
    }

    const cleanup = await module.init();
    if (typeof cleanup === 'function') {
      cleanupByModuleId.set(module.id, cleanup);
    }

    initializedModules.add(module.id);
  }
};

export const cleanupModules = (): void => {
  for (const [id, cleanup] of cleanupByModuleId.entries()) {
    try {
      cleanup();
    } finally {
      cleanupByModuleId.delete(id);
      initializedModules.delete(id);
    }
  }
};

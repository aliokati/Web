export function serverEnv(name: string): string | undefined {
  const viteEnvironment = import.meta.env as Record<string, string | undefined>;
  return process.env[name] ?? viteEnvironment[name];
}

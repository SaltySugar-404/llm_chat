import { ref } from 'vue';

export type Role = {
  role_name: string;
  image_path: string;
  prompt: string;
  welcome: string;
};

function createRole(): Role {
  return {
    role_name: 'null',
    image_path: 'null',
    prompt: 'null',
    welcome: 'null'
  }
}

export function getAvailableRoleNames(): string[] {
  const modules = import.meta.glob('/src/roles/**/config.json');
  const names = Object.keys(modules)
    .map((path) => {
      const match = path.match(/\/src\/roles\/([^/]+)\/config\.json$/);
      return match?.[1] || null;
    })
    .filter((name): name is string => !!name);
  return [...new Set(names)];
}

export const available_roles = ref<string[]>(getAvailableRoleNames());

export const current_role = ref(createRole())

export async function switchRole(role_name: string) {
  if (!available_roles.value.includes(role_name)) return;

  const image_path = `/src/roles/${role_name}/image.jpg`;

  const configModules = import.meta.glob('/src/roles/**/config.json', { eager: true });

  const matchPath = Object.keys(configModules).find((path) =>
    path.includes(`/src/roles/${role_name}/config.json`)
  );

  if (!matchPath) return;

  const config = configModules[matchPath] as { prompt: string; welcome: string };

  current_role.value = {
    role_name,
    image_path,
    prompt: config.prompt,
    welcome: config.welcome,
  };
}
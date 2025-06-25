import { ref } from 'vue';

export type Role = {
    name: string;
    image_path: string;
    prompt: string;
};

function createRole(): Role {
    return {
        name: 'null',
        image_path: 'null',
        prompt: 'null'
    }
}

export const current_role = ref(createRole())

export function getAvailableRoleNames(): string[] {
    const modules = import.meta.glob('/src/roles/**/prompt.txt');
    const names = Object.keys(modules)
        .map((path) => {
            const match = path.match(/\/src\/roles\/([^/]+)\/prompt\.txt$/);
            return match?.[1] || null;
        })
        .filter((name): name is string => !!name);
    return [...new Set(names)];
}

export const available_roles = ref<string[]>(getAvailableRoleNames());

export async function switchRole(role_name: string) {
  if (!available_roles.value.includes(role_name)) {
    console.warn(`非法角色名: ${role_name}`);
    return;
  }

  const base_path = `/src/roles/${role_name}`;
  const image_path = `${base_path}/image.jpg`;
  const prompt = `${base_path}/prompt.txt`;

  try {
    const modules = import.meta.glob('/src/roles/**/prompt.txt', { as: 'raw' });
    const matchPath = Object.keys(modules).find((path) =>
      path.includes(`/src/roles/${role_name}/prompt.txt`)
    );
    if (!matchPath) {
      throw new Error(`找不到 ${role_name} 的 prompt.txt`);
    }
    const prompt = await modules[matchPath]();

    current_role.value = {
      name: role_name,
      image_path: image_path,
      prompt: prompt,
    };
  } catch (error) {
    console.error(`切换角色失败: ${role_name}`, error);
  }
}



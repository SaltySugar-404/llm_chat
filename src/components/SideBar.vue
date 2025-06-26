<template>
    <div style="height: 100vh;background-color: black;">
        <el-row style="height: 15%;">
            <el-col>
                <el-avatar :size="120" :src="current_role.image_path"
                    style="border: 5px solid white; box-sizing: border-box;" alt="Model Avatar" />
            </el-col>
        </el-row>
        <el-row style="height: 5%;">
            <el-col>
                <select v-model="selectedRole" @change="onRoleChange" class="select_role">
                    <option v-for="role in available_roles" :key="role" :value="role">{{ role }}</option>
                </select>
            </el-col>
        </el-row>
        <el-row style="height: 5%;">
            <el-col>
                <el-button class="new_chat_button" @click="newChat">New Chat</el-button>
            </el-col>
        </el-row>
        <el-row style="height: 65%;">
            <el-col>
                <el-scrollbar style="height: 100%; width: 100%;">
                    <div v-for="chat in [...history].sort((a, b) => b.timestamp - a.timestamp)" :key="chat.timestamp"
                        class="chat" @mouseenter="hoveredChat = chat.timestamp" @mouseleave="hoveredChat = null"
                        :style="{ backgroundColor: hoveredChat === chat.timestamp ? '#303030' : 'transparent' }">
                        <el-row style="width: 100%">
                            <el-col :span="20">
                                <div style="flex: 1; cursor: pointer;" @click="onSelectChat(chat.timestamp)">
                                    {{ chat.summary }}
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <el-button v-if="hoveredChat === chat.timestamp" class="delete_button" :icon="Delete"
                                    circle @click="deleteChat(chat.timestamp)" />
                            </el-col>
                        </el-row>
                    </div>
                </el-scrollbar>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { history, switchChat, newChat, deleteChat } from '../modules/main_logic';
import { current_role, switchRole, available_roles } from '../modules/role';
import { Delete } from '@element-plus/icons-vue';

const selectedRole = ref('Evil Neuro');
const hoveredChat = ref<number | null>(null);

const onRoleChange = async (event: Event) => {
    await switchRole(selectedRole.value);
};

onMounted(() => {
    switchRole(selectedRole.value);
});

function onSelectChat(timestamp: number) {
    switchChat(timestamp);
}
</script>

<style scoped>
.el-row {
    height: 100%;
    width: 100%;
}

.el-col {
    height: 100%;
    width: 100%;
    padding: 5px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.select_role {
    width: 100%;
    height: 100%;
    padding: 5px 10px;
    background-color: #303030;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: medium;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 1em;
}

.select_role:focus {
    outline: none;
    box-shadow: 0 0 0 2px #555;
}

.new_chat_button {
    width: 100%;
    height: 100%;
    border-width: 0px;
    color: white;
    background: #303030;
    border-radius: 10px;
    font-size: medium;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;
}

.chat {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    font-size: medium;
    transition: background-color 0.2s ease;
}

.delete_button {
    background-color: #303030;
    border: none;
    color: white;
}

.delete_button:hover {
    background-color: #555;
}
</style>
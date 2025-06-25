<template>
    <div style="height: 100vh;">
        <el-row style="height: 15%;">
            <el-col style="display: flex; justify-content: center; align-items: center;">
                <el-avatar :size="120" :src="current_role.image_path"
                    style="border: 5px solid #303030; box-sizing: border-box;" alt="Model Avatar" />
            </el-col>
        </el-row>
        <el-row style="height: 5%;">
            <el-col>
                <el-select v-model="selectedRole" placeholder="Select Role" style="width: 100%" @change="onRoleChange">
                    <el-option v-for="role in available_roles" :key="role" :label="role" :value="role" />
                </el-select>
            </el-col>
        </el-row>
        <el-row style="height: 5%;">
            <el-col>
                <el-button class="button" @click="newChat">New Chat</el-button>
            </el-col>
        </el-row>
        <el-row style="height: 5%;">
            <el-col style="height: 100%; padding: 5px 10px;color: white; font-size: large;">chat</el-col>
        </el-row>
        <el-row style="height: 90%;">
            <el-col>
                <el-scrollbar style="height: 100%; ">
                    <p v-for="chat in history" :key="chat.timestamp" class="scrollbar-items"
                        @click="onSelectChat(chat.timestamp)">
                        {{ chat.summary }}
                    </p>
                </el-scrollbar>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { current_chat, history, switchChat, newChat } from '../modules/main_logic';
import { current_role, switchRole, available_roles } from '../modules/roles'
function onSelectChat(timestamp: number) {
    switchChat(timestamp);
}
const selectedRole = ref('Evil Neuro');

const onRoleChange = async (newRole: string) => {
    await switchRole(newRole);
};

onMounted(() => {
    switchRole(selectedRole.value);
});
</script>

<style scoped>
.el-row {
    height: 100%;
}

.el-col {
    height: 100%;
    padding: 5px 10px;
}

.button {
    width: 100%;
    height: 100%;
    border-width: 0px;
    color: white;
    background: #303030;
    border-radius: 10px;
}

.scrollbar-items {
    width: 100%;
    height: 50px;
    border-radius: 10px;
    border-width: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background: #303030;
}

.scrollbar-items:first-child {
    top: 0px;
}
</style>../modules/code../modules/logic../modules/main../modules/main_logic
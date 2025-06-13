<template>
    <el-row>
        <el-col>
            <el-button class="button">Default</el-button>
        </el-col>
    </el-row>
    <el-row>
        <el-col>
            <el-scrollbar height="80%">
                <p v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</p>
            </el-scrollbar>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { chat, callModel } from '../utils/chat.ts'
</script>

<style scoped>
.scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
}
</style>
/** * User Search Component * 用户搜索表单组件 */
<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NCard, NForm, NFormItem, NInput, NSpace } from 'naive-ui';

const emit = defineEmits<{
  search: [params: any];
}>();

const formRef = ref();
const formModel = ref({
  keyword: ''
});

/**
 * Handle search
 */
function handleSearch() {
  emit('search', {
    keyword: formModel.value.keyword || undefined
  });
}

/**
 * Handle reset
 */
function handleReset() {
  formModel.value.keyword = '';
  emit('search', {});
}
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <NForm ref="formRef" :model="formModel" inline label-placement="left">
      <NFormItem label="关键词" path="keyword">
        <NInput v-model:value="formModel.keyword" placeholder="用户ID或昵称" clearable @keyup.enter="handleSearch" />
      </NFormItem>

      <NFormItem>
        <NSpace>
          <NButton type="primary" @click="handleSearch">
            <template #icon>
              <icon-mdi-magnify />
            </template>
            搜索
          </NButton>
          <NButton @click="handleReset">
            <template #icon>
              <icon-mdi-refresh />
            </template>
            重置
          </NButton>
        </NSpace>
      </NFormItem>
    </NForm>
  </NCard>
</template>

<style scoped>
.card-wrapper {
  margin-bottom: 16px;
}
</style>

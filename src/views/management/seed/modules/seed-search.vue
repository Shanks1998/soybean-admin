/** * Seed Search Component * 种子搜索表单组件 */
<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NForm, NFormItem, NInput, NSelect, NSpace } from 'naive-ui';
import { SEED_STATUS } from '@/constants/business';

const emit = defineEmits<{
  search: [params: any];
}>();

const formRef = ref();
const formModel = ref({
  keyword: '',
  status: undefined as number | undefined
});

const statusOptions = [
  { label: '全部', value: undefined },
  { label: '启用', value: SEED_STATUS.ENABLED },
  { label: '禁用', value: SEED_STATUS.DISABLED }
];

/**
 * Handle search
 */
function handleSearch() {
  emit('search', {
    keyword: formModel.value.keyword || undefined,
    status: formModel.value.status
  });
}

/**
 * Handle reset
 */
function handleReset() {
  formModel.value = {
    keyword: '',
    status: undefined
  };
  emit('search', {});
}
</script>

<template>
  <NForm ref="formRef" :model="formModel" inline label-placement="left">
    <NFormItem label="关键词" path="keyword">
      <NInput v-model:value="formModel.keyword" placeholder="种子名称" clearable @keyup.enter="handleSearch" />
    </NFormItem>

    <NFormItem label="状态" path="status">
      <NSelect
        v-model:value="formModel.status"
        :options="statusOptions"
        placeholder="请选择状态"
        clearable
        style="width: 120px"
      />
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
</template>

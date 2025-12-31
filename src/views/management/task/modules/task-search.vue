/** * Task Search Component * 任务搜索表单组件 */
<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NForm, NFormItem, NInput, NSelect, NSpace } from 'naive-ui';

const emit = defineEmits<{
  search: [params: any];
}>();

const formRef = ref();
const formModel = ref<{ keyword: string; is_enabled: number | undefined }>({
  keyword: '',
  is_enabled: undefined
});

const statusOptions = [
  { label: '全部', value: undefined },
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
];

/**
 * Handle search
 */
function handleSearch() {
  const params: any = {
    keyword: formModel.value.keyword || undefined
  };
  if (formModel.value.is_enabled !== undefined) {
    params.is_enabled = formModel.value.is_enabled === 1;
  }
  emit('search', params);
}

/**
 * Handle reset
 */
function handleReset() {
  formModel.value = {
    keyword: '',
    is_enabled: undefined
  };
  emit('search', {});
}
</script>

<template>
  <NForm ref="formRef" :model="formModel" inline label-placement="left">
    <NFormItem label="关键词" path="keyword">
      <NInput v-model:value="formModel.keyword" placeholder="任务名称或类型" clearable @keyup.enter="handleSearch" />
    </NFormItem>

    <NFormItem label="状态" path="is_enabled">
      <NSelect
        v-model:value="formModel.is_enabled"
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

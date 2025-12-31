/** * Harvest Search Component * 收获记录搜索表单组件 */
<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NCard, NForm, NFormItem, NInput, NSelect, NSpace } from 'naive-ui';
import { HARVEST_STATUS_MAP } from '@/constants/business';

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
  ...Object.entries(HARVEST_STATUS_MAP).map(([value, config]) => ({
    label: config.label,
    value: Number(value)
  }))
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
  <NCard :bordered="false" class="card-wrapper">
    <NForm ref="formRef" :model="formModel" inline label-placement="left">
      <NFormItem label="关键词" path="keyword">
        <NInput v-model:value="formModel.keyword" placeholder="用户ID或收货人" clearable @keyup.enter="handleSearch" />
      </NFormItem>

      <NFormItem label="状态" path="status">
        <NSelect
          v-model:value="formModel.status"
          :options="statusOptions"
          placeholder="请选择状态"
          clearable
          style="width: 140px"
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
  </NCard>
</template>

<style scoped>
.card-wrapper {
  margin-bottom: 16px;
}
</style>

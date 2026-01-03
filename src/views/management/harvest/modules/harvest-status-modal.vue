/** * Harvest Status Modal Component * 收获记录状态更新弹窗组件 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { NButton, NForm, NFormItem, NModal, NSelect } from 'naive-ui';
import { HARVEST_STATUS, HARVEST_STATUS_MAP } from '@/constants/business';
import { updateHarvestStatus } from '@/service/api';

interface Props {
  visible: boolean;
  record: Api.Admin.Harvest.HarvestRecord | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  success: [];
}>();

const formRef = ref();
const submitting = ref(false);
const formModel = ref({
  status: HARVEST_STATUS.PENDING as Api.Admin.Harvest.HarvestStatus
});

const statusOptions = Object.entries(HARVEST_STATUS_MAP).map(([value, config]) => ({
  label: config.label,
  value: value as Api.Admin.Harvest.HarvestStatus
}));

const rules = {
  status: {
    required: true,
    type: 'string',
    message: '请选择状态',
    trigger: 'change'
  }
} as any;

/**
 * Handle submit
 */
async function handleSubmit() {
  if (!props.record) return;

  await formRef.value?.validate();

  submitting.value = true;
  try {
    await updateHarvestStatus(props.record.id, {
      status: formModel.value.status
    });

    window.$message?.success('状态更新成功');
    emit('success');
    handleClose();
  } catch {
  } finally {
    submitting.value = false;
  }
}

/**
 * Handle close
 */
function handleClose() {
  formRef.value?.restoreValidation();
  emit('update:visible', false);
}

// Watch visible and record change
watch(
  () => props.visible,
  visible => {
    if (visible && props.record) {
      formModel.value.status = props.record.status;
    }
  }
);
</script>

<template>
  <NModal :show="visible" preset="card" title="更新收获记录状态" class="w-500px" @update:show="handleClose">
    <NForm ref="formRef" :model="formModel" :rules="rules" label-placement="left" label-width="120">
      <NFormItem label="记录状态" path="status">
        <NSelect v-model:value="formModel.status" :options="statusOptions" placeholder="请选择状态" />
      </NFormItem>
      <NFormItem>
        <div class="text-sm text-gray-500">说明：待处理 → 处理中 → 已发货 → 已完成。如需拒绝，可选择已拒绝状态。</div>
      </NFormItem>
    </NForm>

    <template #footer>
      <div class="flex justify-end gap-3">
        <NButton @click="handleClose">取消</NButton>
        <NButton type="primary" :loading="submitting" @click="handleSubmit">确定</NButton>
      </div>
    </template>
  </NModal>
</template>

<style scoped>
.text-gray-500 {
  color: #a0a0a0;
}

.text-sm {
  font-size: 0.875rem;
}

.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.gap-3 {
  gap: 12px;
}
</style>

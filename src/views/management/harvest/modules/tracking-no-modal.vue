/** * Tracking Number Modal Component * 快递单号更新弹窗组件 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { NButton, NForm, NFormItem, NInput, NModal } from 'naive-ui';
import { updateTrackingNo } from '@/service/api';

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
  tracking_no: ''
});

const rules = {
  tracking_no: {
    required: true,
    message: '请输入快递单号',
    trigger: 'blur'
  }
};

/**
 * Handle submit
 */
async function handleSubmit() {
  if (!props.record) return;

  await formRef.value?.validate();

  submitting.value = true;
  try {
    await updateTrackingNo(props.record.id, {
      tracking_no: formModel.value.tracking_no
    });

    window.$message?.success('快递单号更新成功');
    emit('success');
    handleClose();
  } catch (error) {
    console.error('Failed to update tracking number:', error);
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
// Watch visible change
watch(
  () => props.visible,
  visible => {
    if (visible && props.record) {
      formModel.value.tracking_no = props.record.tracking_no || '';
    }
  }
);
</script>

<template>
  <NModal :show="visible" preset="card" title="更新快递单号" :style="{ width: '500px' }" @update:show="handleClose">
    <NForm ref="formRef" :model="formModel" :rules="rules" label-placement="left" label-width="120">
      <NFormItem label="快递单号" path="tracking_no">
        <NInput
          v-model:value="formModel.tracking_no"
          placeholder="请输入快递单号"
          clearable
          maxlength="64"
          show-count
        />
      </NFormItem>
      <NFormItem>
        <div class="text-sm text-gray-500">
          说明：填写快递单号后，用户可在小程序中查看物流信息。建议同时将状态更新为"已发货"。
        </div>
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

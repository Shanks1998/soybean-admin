/** * Fertilizer Adjust Modal Component * 肥料调整弹窗组件 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { NButton, NForm, NFormItem, NInput, NInputNumber, NModal } from 'naive-ui';
import { adjustUserFertilizer } from '@/service/api';

interface Props {
  visible: boolean;
  userId: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  success: [];
}>();

const formRef = ref();
const submitting = ref(false);
const formModel = ref({
  amount: 0,
  reason: ''
});

const rules = {
  amount: {
    required: true,
    type: 'number' as const,
    message: '请输入调整数量',
    trigger: 'blur'
  },
  reason: {
    required: true,
    message: '请输入调整原因',
    trigger: 'blur'
  }
};

/**
 * Handle submit
 */
async function handleSubmit() {
  await formRef.value?.validate();

  submitting.value = true;
  try {
    await adjustUserFertilizer(props.userId, {
      amount: formModel.value.amount,
      reason: formModel.value.reason
    });

    window.$message?.success('肥料调整成功');
    emit('success');
    handleClose();
  } catch (error) {
    console.error('Failed to adjust fertilizer:', error);
  } finally {
    submitting.value = false;
  }
}

/**
 * Handle close
 */
function handleClose() {
  formRef.value?.restoreValidation();
  formModel.value = {
    amount: 0,
    reason: ''
  };
  emit('update:visible', false);
}

// Watch visible change
watch(
  () => props.visible,
  val => {
    if (!val) {
      formRef.value?.restoreValidation();
    }
  }
);
</script>

<template>
  <NModal :show="visible" preset="card" title="调整肥料" :style="{ width: '500px' }" @update:show="handleClose">
    <NForm ref="formRef" :model="formModel" :rules="rules" label-placement="left" label-width="120">
      <NFormItem label="调整数量" path="amount">
        <NInputNumber
          v-model:value="formModel.amount"
          placeholder="正数增加，负数减少"
          :show-button="false"
          class="w-full"
        />
      </NFormItem>
      <NFormItem label="调整原因" path="reason">
        <NInput
          v-model:value="formModel.reason"
          type="textarea"
          placeholder="请输入调整原因，如：活动奖励、补偿等"
          :rows="3"
        />
      </NFormItem>
      <NFormItem>
        <div class="text-sm text-gray-500">说明：输入正数增加肥料，输入负数减少肥料。调整原因将被记录用于审计。</div>
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
.w-full {
  width: 100%;
}

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

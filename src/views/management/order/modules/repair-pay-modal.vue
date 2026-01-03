/** * Repair Pay Modal Component * 补单支付弹窗组件 */
<script setup lang="ts">
import { ref } from 'vue';
import { NAlert, NButton, NForm, NFormItem, NInput, NModal } from 'naive-ui';
import { repairOrderPay } from '@/service/api';

interface Props {
  visible: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const formRef = ref();
const submitting = ref(false);
const formModel = ref({
  order_id: ''
});

const rules = {
  order_id: {
    required: true,
    message: '请输入订单ID',
    trigger: 'blur',
    validator: (_rule: any, value: string) => {
      if (!value) {
        return new Error('请输入订单ID');
      }
      if (!/^\d+$/.test(value)) {
        return new Error('订单ID必须为数字');
      }
      return true;
    }
  }
};

/**
 * Handle submit
 */
async function handleSubmit() {
  await formRef.value?.validate();

  // Double confirmation
  const confirmed = await window.$dialog?.warning({
    title: '确认补单支付',
    content: `确定要对订单 ${formModel.value.order_id} 执行补单支付吗？此操作将触发订单支付成功的所有业务逻辑，请谨慎操作！`,
    positiveText: '确定执行',
    negativeText: '取消'
  });

  if (!confirmed) return;

  submitting.value = true;
  try {
    await repairOrderPay({
      order_id: formModel.value.order_id
    });

    window.$message?.success('补单支付执行成功');
    handleClose();
  } catch {
    // Error handled by request interceptor
  } finally {
    submitting.value = false;
  }
}

/**
 * Handle close
 */
function handleClose() {
  formRef.value?.restoreValidation();
  formModel.value.order_id = '';
  emit('update:visible', false);
}
</script>

<template>
  <NModal :show="visible" preset="card" title="补单支付" class="w-600px" @update:show="handleClose">
    <NAlert type="warning" title="操作风险提示" :bordered="false" class="mb-4">
      此操作将强制触发订单支付成功的业务逻辑，包括：
      <ul class="mt-2">
        <li>更新订单状态为"已支付"</li>
        <li>触发相关业务流程（如发货、积分奖励等）</li>
        <li>记录订单支付日志</li>
      </ul>
      <strong class="text-error">请确保订单确实已完成支付，避免重复处理！</strong>
    </NAlert>

    <NForm ref="formRef" :model="formModel" :rules="rules" label-placement="left" label-width="100">
      <NFormItem label="订单ID" path="order_id">
        <NInput v-model:value="formModel.order_id" placeholder="请输入需要补单的订单ID" clearable />
      </NFormItem>
      <NFormItem>
        <div class="text-sm text-gray-500">提示：请从订单系统或日志中确认订单ID，并确保该订单确实需要补单处理。</div>
      </NFormItem>
    </NForm>

    <template #footer>
      <div class="flex justify-end gap-3">
        <NButton @click="handleClose">取消</NButton>
        <NButton type="warning" :loading="submitting" @click="handleSubmit">确定执行</NButton>
      </div>
    </template>
  </NModal>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}

.mt-2 {
  margin-top: 8px;
}

.text-error {
  color: var(--n-error-color);
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

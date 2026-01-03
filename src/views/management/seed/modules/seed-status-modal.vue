/** * Seed Status Modal Component * 种子状态更新弹窗组件 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { NButton, NForm, NFormItem, NModal, NSwitch } from 'naive-ui';
import { SEED_STATUS } from '@/constants/business';
import { updateSeedStatus } from '@/service/api';

interface Props {
  visible: boolean;
  seed: Api.Admin.Seed.SeedConfig | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  success: [];
}>();

const formRef = ref();
const submitting = ref(false);
const formModel = ref({
  status: SEED_STATUS.ENABLED as 0 | 1
});

/**
 * Handle submit
 */
async function handleSubmit() {
  if (!props.seed) return;

  submitting.value = true;
  try {
    await updateSeedStatus(props.seed.id, {
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
  emit('update:visible', false);
}

// Watch visible and seed change
// Watch visible change
watch(
  () => props.visible,
  visible => {
    if (visible && props.seed) {
      formModel.value.status = props.seed.status;
    }
  }
);
</script>

<template>
  <NModal :show="visible" preset="card" title="更新种子状态" class="w-500px" @update:show="handleClose">
    <NForm ref="formRef" :model="formModel" label-placement="left" label-width="120">
      <NFormItem label="种子状态">
        <NSwitch
          v-model:value="formModel.status"
          :checked-value="SEED_STATUS.ENABLED"
          :unchecked-value="SEED_STATUS.DISABLED"
        >
          <template #checked>启用</template>
          <template #unchecked>禁用</template>
        </NSwitch>
        <span class="ml-3 text-gray-500">
          {{ formModel.status === SEED_STATUS.ENABLED ? '用户可在游戏中看到此种子' : '种子将不会在游戏中显示' }}
        </span>
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
.ml-3 {
  margin-left: 12px;
}

.text-gray-500 {
  color: #a0a0a0;
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

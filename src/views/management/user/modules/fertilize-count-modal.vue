/** * Fertilize Count Modal Component * 施肥次数调整弹窗组件 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { NButton, NForm, NFormItem, NInputNumber, NModal, NSpin } from 'naive-ui';
import { fetchUserDetail, updateUserMaxDailyFertilizeCount } from '@/service/api';

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
const loading = ref(false);
const submitting = ref(false);
const formModel = ref({
  max_daily_fertilize_count: 6
});

const rules = {
  max_daily_fertilize_count: {
    required: true,
    type: 'number' as const,
    message: '请输入每日最大施肥次数',
    trigger: 'blur',
    validator: (_rule: any, value: number) => {
      if (value < 1) {
        return new Error('施肥次数必须大于0');
      }
      if (value > 100) {
        return new Error('施肥次数不能超过100');
      }
      return true;
    }
  }
};

/**
 * Fetch user data
 */
async function fetchData() {
  if (!props.userId) return;

  loading.value = true;
  try {
    const { data } = await fetchUserDetail(props.userId);
    if (data) {
      formModel.value.max_daily_fertilize_count = data.game_state.max_daily_fertilize_count;
    }
  } catch {
  } finally {
    loading.value = false;
  }
}

/**
 * Handle submit
 */
async function handleSubmit() {
  await formRef.value?.validate();

  submitting.value = true;
  try {
    await updateUserMaxDailyFertilizeCount(props.userId, {
      max_daily_fertilize_count: formModel.value.max_daily_fertilize_count
    });

    window.$message?.success('施肥次数更新成功');
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

// Watch visible change
watch(
  () => props.visible,
  val => {
    if (val) {
      fetchData();
    }
  }
);
</script>

<template>
  <NModal :show="visible" preset="card" title="更新每日最大施肥次数" class="w-500px" @update:show="handleClose">
    <NSpin :show="loading">
      <NForm ref="formRef" :model="formModel" :rules="rules" label-placement="left" label-width="160">
        <NFormItem label="每日最大施肥次数" path="max_daily_fertilize_count">
          <NInputNumber
            v-model:value="formModel.max_daily_fertilize_count"
            :min="1"
            :max="100"
            :show-button="true"
            class="w-full"
          />
        </NFormItem>
        <NFormItem>
          <div class="text-sm text-gray-500">说明：设置用户每天最多可以给果树施肥的次数，范围1-100次。</div>
        </NFormItem>
      </NForm>
    </NSpin>

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

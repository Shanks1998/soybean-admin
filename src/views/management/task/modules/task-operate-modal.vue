/** * Task Operate Modal Component (Add/Edit) * 任务新增/编辑弹窗组件 */
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { NButton, NForm, NFormItem, NInput, NInputNumber, NModal, NSelect, NSwitch } from 'naive-ui';
import { TASK_TYPES } from '@/constants/business';
import { createTask, updateTask } from '@/service/api';

interface Props {
  visible: boolean;
  type: 'add' | 'edit';
  editData?: Api.Admin.Task.TaskConfig | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  success: [];
}>();

const formRef = ref();
const submitting = ref(false);

const formModel = ref({
  task_name: '',
  task_type: '',
  description: '',
  reward: 10,
  max_count: 1,
  is_one_time: false,
  is_enabled: true,
  need_claim: false,
  sort_order: 0
});

const rules = {
  task_name: {
    required: true,
    message: '请输入任务名称',
    trigger: 'blur'
  },
  task_type: {
    required: true,
    message: '请选择任务类型',
    trigger: 'change'
  },
  reward: {
    required: true,
    type: 'number' as const,
    message: '请输入奖励数量',
    trigger: 'blur',
    validator: (_rule: any, value: number) => {
      if (value < 1) {
        return new Error('奖励数量必须大于0');
      }
      return true;
    }
  },
  max_count: {
    required: true,
    type: 'number' as const,
    message: '请输入每日最大次数',
    trigger: 'blur',
    validator: (_rule: any, value: number) => {
      if (!formModel.value.is_one_time && value < 1) {
        return new Error('每日次数必须大于0');
      }
      return true;
    }
  }
};

const modalTitle = computed(() => {
  return props.type === 'add' ? '新增任务' : '编辑任务';
});

/**
 * Handle submit
 */
async function handleSubmit() {
  await formRef.value?.validate();

  submitting.value = true;
  try {
    const data = {
      task_name: formModel.value.task_name,
      task_type: formModel.value.task_type,
      description: formModel.value.description || undefined,
      reward: formModel.value.reward,
      max_count: formModel.value.max_count,
      is_one_time: formModel.value.is_one_time,
      is_enabled: formModel.value.is_enabled,
      need_claim: formModel.value.need_claim,
      sort_order: formModel.value.sort_order
    };

    if (props.type === 'add') {
      await createTask(data);
      window.$message?.success('新增成功');
    } else if (props.editData) {
      await updateTask(props.editData.id, data);
      window.$message?.success('编辑成功');
    }

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
  resetForm();
  emit('update:visible', false);
}

/**
 * Reset form
 */
function resetForm() {
  formModel.value = {
    task_name: '',
    task_type: '',
    description: '',
    reward: 10,
    max_count: 1,
    is_one_time: false,
    is_enabled: true,
    need_claim: false,
    sort_order: 0
  };
}

// Watch visible and editData change
// Watch visible change
watch(
  () => props.visible,
  visible => {
    if (visible) {
      if (props.type === 'edit' && props.editData) {
        formModel.value = {
          task_name: props.editData.task_name,
          task_type: props.editData.task_type,
          description: props.editData.description || '',
          reward: props.editData.reward,
          max_count: props.editData.max_count,
          is_one_time: props.editData.is_one_time,
          is_enabled: props.editData.is_enabled,
          need_claim: props.editData.need_claim,
          sort_order: props.editData.sort_order
        };
      } else {
        resetForm();
      }
    }
  }
);
</script>

<template>
  <NModal :show="visible" preset="card" :title="modalTitle" class="w-600px" @update:show="handleClose">
    <NForm ref="formRef" :model="formModel" :rules="rules" label-placement="left" label-width="140">
      <NFormItem label="任务名称" path="task_name">
        <NInput
          v-model:value="formModel.task_name"
          placeholder="请输入任务名称，如：浏览商品"
          maxlength="64"
          show-count
        />
      </NFormItem>

      <NFormItem label="任务类型" path="task_type">
        <NSelect v-model:value="formModel.task_type" :options="TASK_TYPES" placeholder="请选择任务类型" clearable />
      </NFormItem>

      <NFormItem label="任务描述" path="description">
        <NInput
          v-model:value="formModel.description"
          type="textarea"
          placeholder="请输入任务描述（可选）"
          :rows="3"
          maxlength="255"
          show-count
        />
      </NFormItem>

      <NFormItem label="单次奖励(肥料)" path="reward">
        <NInputNumber
          v-model:value="formModel.reward"
          placeholder="单次完成奖励的肥料数量"
          :min="1"
          :show-button="true"
          class="w-full"
        />
      </NFormItem>

      <NFormItem label="每日最大次数" path="max_count">
        <NInputNumber
          v-model:value="formModel.max_count"
          placeholder="每天最多可完成次数"
          :min="1"
          :disabled="formModel.is_one_time"
          :show-button="true"
          class="w-full"
        />
      </NFormItem>

      <NFormItem label="是否一次性任务">
        <NSwitch v-model:value="formModel.is_one_time">
          <template #checked>是</template>
          <template #unchecked>否</template>
        </NSwitch>
        <span class="ml-3 text-sm text-gray-500">一次性任务只能完成一次，不受每日次数限制</span>
      </NFormItem>

      <NFormItem label="是否需要领取">
        <NSwitch v-model:value="formModel.need_claim">
          <template #checked>是</template>
          <template #unchecked>否</template>
        </NSwitch>
        <span class="ml-3 text-sm text-gray-500">需要用户主动领取奖励</span>
      </NFormItem>

      <NFormItem label="是否启用">
        <NSwitch v-model:value="formModel.is_enabled">
          <template #checked>启用</template>
          <template #unchecked>禁用</template>
        </NSwitch>
        <span class="ml-3 text-sm text-gray-500">
          {{ formModel.is_enabled ? '任务在游戏中可见' : '任务将不会显示' }}
        </span>
      </NFormItem>

      <NFormItem label="排序" path="sort_order">
        <NInputNumber
          v-model:value="formModel.sort_order"
          placeholder="排序值，数字越小越靠前"
          :min="0"
          :show-button="true"
          class="w-full"
        />
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

.ml-3 {
  margin-left: 12px;
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

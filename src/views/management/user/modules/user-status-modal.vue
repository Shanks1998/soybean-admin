/** * User Status Modal Component * 用户状态更新弹窗组件 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { NButton, NForm, NFormItem, NModal, NSpin, NSwitch } from 'naive-ui';
import { USER_STATUS } from '@/constants/business';
import { fetchUserDetail, updateUserStatus } from '@/service/api';

interface Props {
  visible: boolean;
  userId: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  success: [];
}>();

const loading = ref(false);
const submitting = ref(false);
const formModel = ref({
  status: USER_STATUS.NORMAL as 0 | 1
});

/**
 * Fetch user data
 */
async function fetchData() {
  if (!props.userId) return;

  loading.value = true;
  try {
    const { data } = await fetchUserDetail(props.userId);
    if (data) {
      formModel.value.status = data.user.status;
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
  } finally {
    loading.value = false;
  }
}

/**
 * Handle submit
 */
async function handleSubmit() {
  submitting.value = true;
  try {
    await updateUserStatus(props.userId, {
      status: formModel.value.status
    });

    window.$message?.success('状态更新成功');
    emit('success');
    handleClose();
  } catch (error) {
    console.error('Failed to update status:', error);
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
  <NModal :show="visible" preset="card" title="更新用户状态" :style="{ width: '500px' }" @update:show="handleClose">
    <NSpin :show="loading">
      <NForm :model="formModel" label-placement="left" label-width="120">
        <NFormItem label="用户状态">
          <NSwitch
            v-model:value="formModel.status"
            :checked-value="USER_STATUS.NORMAL"
            :unchecked-value="USER_STATUS.DISABLED"
          >
            <template #checked>正常</template>
            <template #unchecked>禁用</template>
          </NSwitch>
          <span class="ml-3 text-gray-500">
            {{ formModel.status === USER_STATUS.NORMAL ? '用户可正常登录使用' : '用户将无法登录' }}
          </span>
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

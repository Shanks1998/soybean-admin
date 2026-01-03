/** * Seed Operate Modal Component (Add/Edit) * 种子新增/编辑弹窗组件 */
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { NButton, NForm, NFormItem, NInput, NInputNumber, NModal, NSelect } from 'naive-ui';
import { SEED_STATUS } from '@/constants/business';
import { createSeed, updateSeed } from '@/service/api';

interface Props {
  visible: boolean;
  type: 'add' | 'edit';
  editData?: Api.Admin.Seed.SeedConfig | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  success: [];
}>();

const formRef = ref();
const submitting = ref(false);

const formModel = ref({
  name: '',
  icon_url: '',
  shop_sku_id: '',
  coupon_id: '',
  sort_order: 0,
  status: SEED_STATUS.ENABLED as 0 | 1
});

const statusOptions = [
  { label: '启用', value: SEED_STATUS.ENABLED },
  { label: '禁用', value: SEED_STATUS.DISABLED }
];

const rules = {
  name: {
    required: true,
    message: '请输入种子名称',
    trigger: 'blur'
  },
  icon_url: {
    required: true,
    message: '请上传种子图标',
    trigger: 'change'
  }
};

const modalTitle = computed(() => {
  return props.type === 'add' ? '新增种子' : '编辑种子';
});

/**
 * Handle submit
 */
async function handleSubmit() {
  await formRef.value?.validate();

  // At least one of shop_sku_id or coupon_id must be filled
  if (!formModel.value.shop_sku_id && !formModel.value.coupon_id) {
    window.$message?.error('商品SKU和优惠券ID至少填写一个');
    return;
  }

  submitting.value = true;
  try {
    const data = {
      name: formModel.value.name,
      icon_url: formModel.value.icon_url,
      shop_sku_id: formModel.value.shop_sku_id || undefined,
      coupon_id: formModel.value.coupon_id || undefined,
      sort_order: formModel.value.sort_order,
      status: formModel.value.status
    };

    if (props.type === 'add') {
      await createSeed(data);
      window.$message?.success('新增成功');
    } else if (props.editData) {
      await updateSeed(props.editData.id, data);
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
    name: '',
    icon_url: '',
    shop_sku_id: '',
    coupon_id: '',
    sort_order: 0,
    status: SEED_STATUS.ENABLED
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
          name: props.editData.name,
          icon_url: props.editData.icon_url,
          shop_sku_id: props.editData.shop_sku_id || '',
          coupon_id: props.editData.coupon_id || '',
          sort_order: props.editData.sort_order,
          status: props.editData.status
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
    <NForm ref="formRef" :model="formModel" :rules="rules" label-placement="left" label-width="120">
      <NFormItem label="种子名称" path="name">
        <NInput v-model:value="formModel.name" placeholder="请输入种子名称，如：突尼斯石榴" maxlength="64" show-count />
      </NFormItem>

      <NFormItem label="种子图标" path="icon_url">
        <NInput v-model:value="formModel.icon_url" placeholder="请输入图片URL" clearable />
      </NFormItem>

      <NFormItem label="商品SKU" path="shop_sku_id">
        <NInput v-model:value="formModel.shop_sku_id" placeholder="微信小店商品SKU ID（二选一）" clearable />
      </NFormItem>

      <NFormItem label="优惠券ID" path="coupon_id">
        <NInput v-model:value="formModel.coupon_id" placeholder="优惠券ID（二选一）" clearable />
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

      <NFormItem label="状态" path="status">
        <NSelect v-model:value="formModel.status" :options="statusOptions" />
      </NFormItem>

      <NFormItem>
        <div class="text-sm text-gray-500">说明：商品SKU和优惠券ID至少填写一个。排序值越小，种子在列表中越靠前。</div>
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

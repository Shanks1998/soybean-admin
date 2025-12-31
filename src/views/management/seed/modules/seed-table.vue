/** * Seed Table Component * 种子表格组件（支持拖拽排序） */
<script setup lang="ts">
import { h } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NDataTable, NImage, NSpace, NSwitch } from 'naive-ui';
import { SEED_STATUS } from '@/constants/business';
import { updateSeedStatus } from '@/service/api';
import { formatDateTime } from '@/utils/format';

interface Props {
  loading: boolean;
  data: Api.Admin.Seed.SeedConfig[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

interface Emits {
  (e: 'page-change', page: number): void;
  (e: 'page-size-change', pageSize: number): void;
  (e: 'edit', record: Api.Admin.Seed.SeedConfig): void;
  (e: 'update-status', record: Api.Admin.Seed.SeedConfig): void;
  (e: 'delete', id: number): void;
  (e: 'sort-change', list: Api.Admin.Seed.SeedConfig[]): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

/**
 * Handle status change (quick toggle)
 */
async function handleStatusChange(row: Api.Admin.Seed.SeedConfig, value: boolean) {
  const newStatus = value ? SEED_STATUS.ENABLED : SEED_STATUS.DISABLED;

  try {
    await updateSeedStatus(row.id, { status: newStatus });
    window.$message?.success('状态更新成功');
    row.status = newStatus;
  } catch (error) {
    console.error('Failed to update status:', error);
    // Revert the change on error
    row.status = value ? SEED_STATUS.DISABLED : SEED_STATUS.ENABLED;
  }
}

const columns: DataTableColumns<Api.Admin.Seed.SeedConfig> = [
  {
    title: '排序',
    key: 'sort_order',
    width: 80,
    align: 'center'
  },
  {
    title: '图标',
    key: 'icon_url',
    width: 100,
    align: 'center',
    render: row => {
      return h(NImage, {
        src: row.icon_url,
        fallbackSrc: '/default-seed.png',
        width: 60,
        height: 60,
        objectFit: 'cover',
        style: { borderRadius: '8px' }
      });
    }
  },
  {
    title: '种子名称',
    key: 'name',
    width: 150,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '奖励类型',
    key: 'reward_type',
    width: 120
  },
  {
    title: 'SKU ID',
    key: 'shop_sku_id',
    width: 150,
    ellipsis: {
      tooltip: true
    },
    render: row => row.shop_sku_id || '-'
  },
  {
    title: '优惠券ID',
    key: 'coupon_id',
    width: 150,
    ellipsis: {
      tooltip: true
    },
    render: row => row.coupon_id || '-'
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    align: 'center',
    render: row => {
      return h(
        NSwitch,
        {
          value: row.status === SEED_STATUS.ENABLED,
          onUpdateValue: (value: boolean) => handleStatusChange(row, value)
        },
        {
          checked: () => '启用',
          unchecked: () => '禁用'
        }
      );
    }
  },
  {
    title: '创建时间',
    key: 'created_at',
    width: 180,
    render: row => formatDateTime(row.created_at)
  },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    align: 'center',
    fixed: 'right' as const,
    render: row => {
      return h(NSpace, { justify: 'center' }, () => [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            onClick: () => emit('edit', row)
          },
          () => '编辑'
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            onClick: () => emit('delete', row.id)
          },
          () => '删除'
        )
      ]);
    }
  }
];

function handlePageChange(page: number) {
  emit('page-change', page);
}

function handlePageSizeChange(pageSize: number) {
  emit('page-size-change', pageSize);
}
</script>

<template>
  <NDataTable
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="{
      page: pagination.page,
      pageSize: pagination.pageSize,
      pageCount: Math.ceil(pagination.total / pagination.pageSize),
      itemCount: pagination.total,
      showSizePicker: true,
      pageSizes: [10, 20, 30, 50],
      onUpdatePage: handlePageChange,
      onUpdatePageSize: handlePageSizeChange
    }"
    :scroll-x="1200"
    striped
  />
</template>

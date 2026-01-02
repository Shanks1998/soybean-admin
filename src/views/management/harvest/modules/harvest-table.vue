/** * Harvest Table Component * 收获记录表格组件 */
<script setup lang="ts">
import { h } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NDataTable, NSpace, NTag } from 'naive-ui';
import { HARVEST_STATUS_MAP } from '@/constants/business';
import { formatDateTime } from '@/utils/format';

interface Props {
  loading: boolean;
  data: Api.Admin.Harvest.HarvestRecord[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

interface Emits {
  (e: 'page-change', page: number): void;
  (e: 'page-size-change', pageSize: number): void;
  (e: 'view', record: Api.Admin.Harvest.HarvestRecord): void;
  (e: 'update-status', record: Api.Admin.Harvest.HarvestRecord): void;
  (e: 'update-tracking', record: Api.Admin.Harvest.HarvestRecord): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const columns: DataTableColumns<Api.Admin.Harvest.HarvestRecord> = [
  {
    title: '记录ID',
    key: 'id',
    width: 80,
    align: 'center'
  },
  {
    title: '用户ID',
    key: 'user_id',
    width: 100,
    align: 'center'
  },
  {
    title: '收货人',
    key: 'recipient',
    width: 120,
    ellipsis: {
      tooltip: true
    },
    render: row => row.address_data?.name || '-'
  },
  {
    title: '联系电话',
    key: 'recipient_phone',
    width: 130,
    render: row => row.address_data?.phone || '-'
  },
  {
    title: '收获地址',
    key: 'address',
    width: 250,
    ellipsis: {
      tooltip: true
    },
    render: row => {
      const addr = row.address_data;
      if (!addr) return '-';
      return `${addr.province || ''} ${addr.city || ''} ${addr.district || ''} ${addr.detail || ''}`;
    }
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
    align: 'center',
    render: row => {
      const statusConfig = HARVEST_STATUS_MAP[row.status];
      if (!statusConfig) return '-';
      return h(
        NTag,
        {
          type: statusConfig.type
        },
        () => statusConfig.label
      );
    }
  },
  {
    title: '快递单号',
    key: 'tracking_no',
    width: 180,
    ellipsis: {
      tooltip: true
    },
    render: row => row.tracking_no || '-'
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
    width: 240,
    align: 'center',
    fixed: 'right' as const,
    render: row => {
      return h(NSpace, { justify: 'center' }, () => [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => emit('view', row)
          },
          () => '详情'
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            onClick: () => emit('update-status', row)
          },
          () => '状态'
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            onClick: () => emit('update-tracking', row)
          },
          () => '单号'
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
    :scroll-x="1400"
    striped
  />
</template>

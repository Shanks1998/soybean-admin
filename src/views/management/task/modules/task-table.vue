/** * Task Table Component * 任务表格组件 */
<script setup lang="ts">
import { h } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NDataTable, NSpace, NTag } from 'naive-ui';
import { formatDateTime } from '@/utils/format';

interface Props {
  loading: boolean;
  data: Api.Admin.Task.TaskConfig[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

interface Emits {
  (e: 'pageChange', page: number): void;
  (e: 'pageSizeChange', pageSize: number): void;
  (e: 'edit', record: Api.Admin.Task.TaskConfig): void;
  (e: 'delete', id: number): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const columns: DataTableColumns<Api.Admin.Task.TaskConfig> = [
  {
    title: '排序',
    key: 'sort_order',
    width: 80,
    align: 'center'
  },
  {
    title: '任务名称',
    key: 'task_name',
    width: 150,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '任务类型',
    key: 'task_type',
    width: 150,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '描述',
    key: 'description',
    width: 200,
    ellipsis: {
      tooltip: true
    },
    render: row => row.description || '-'
  },
  {
    title: '奖励(肥料)',
    key: 'reward',
    width: 100,
    align: 'center',
    render: row => `${row.reward}`
  },
  {
    title: '每日次数',
    key: 'max_count',
    width: 100,
    align: 'center',
    render: row => (row.is_one_time ? '-' : `${row.max_count}`)
  },
  {
    title: '一次性',
    key: 'is_one_time',
    width: 80,
    align: 'center',
    render: row => {
      return h(
        NTag,
        {
          type: row.is_one_time ? 'warning' : 'default',
          size: 'small'
        },
        () => (row.is_one_time ? '是' : '否')
      );
    }
  },
  {
    title: '需领取',
    key: 'need_claim',
    width: 80,
    align: 'center',
    render: row => {
      return h(
        NTag,
        {
          type: row.need_claim ? 'info' : 'default',
          size: 'small'
        },
        () => (row.need_claim ? '是' : '否')
      );
    }
  },
  {
    title: '是否启用',
    key: 'is_enabled',
    width: 100,
    align: 'center',
    render: row => {
      return h(
        NTag,
        {
          type: row.is_enabled ? 'success' : 'error',
          size: 'small'
        },
        () => (row.is_enabled ? '启用' : '禁用')
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
    width: 150,
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
  emit('pageChange', page);
}

function handlePageSizeChange(pageSize: number) {
  emit('pageSizeChange', pageSize);
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

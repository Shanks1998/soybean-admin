/** * User Table Component * 用户表格组件 */
<script setup lang="ts">
import { h } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NAvatar, NButton, NDataTable, NSpace, NTag } from 'naive-ui';
import { USER_STATUS_MAP } from '@/constants/business';
import { formatDateTime } from '@/utils/format';

interface Props {
  loading: boolean;
  data: Api.Admin.User.UserInfo[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

interface Emits {
  (e: 'pageChange', page: number): void;
  (e: 'pageSizeChange', pageSize: number): void;
  (e: 'view', id: number): void;
  (e: 'updateStatus', id: number): void;
  (e: 'adjustFertilizer', id: number): void;
  (e: 'updateFertilizeCount', id: number): void;
  (e: 'delete', id: number): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const columns: DataTableColumns<Api.Admin.User.UserInfo> = [
  {
    title: '用户ID',
    key: 'id',
    width: 80,
    align: 'center'
  },
  {
    title: '头像',
    key: 'avatar_url',
    width: 80,
    align: 'center',
    render: row => {
      return h(NAvatar, {
        src: row.avatar_url,
        fallbackSrc: '/default-avatar.png',
        size: 40,
        round: true
      });
    }
  },
  {
    title: '昵称',
    key: 'nickname',
    width: 150,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    align: 'center',
    render: row => {
      const statusConfig = USER_STATUS_MAP[row.status];
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
    title: '注册时间',
    key: 'created_at',
    width: 180,
    render: row => formatDateTime(row.created_at)
  },
  {
    title: '最后登录',
    key: 'last_login_at',
    width: 180,
    render: row => formatDateTime(row.last_login_at)
  },
  {
    title: '操作',
    key: 'actions',
    width: 300,
    align: 'center',
    fixed: 'right' as const,
    render: row => {
      return h(NSpace, { justify: 'center' }, () => [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => emit('view', row.id)
          },
          () => '详情'
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            onClick: () => emit('updateStatus', row.id)
          },
          () => '状态'
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            onClick: () => emit('adjustFertilizer', row.id)
          },
          () => '肥料'
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'warning',
            onClick: () => emit('updateFertilizeCount', row.id)
          },
          () => '次数'
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
    :scroll-x="1200"
    striped
  />
</template>

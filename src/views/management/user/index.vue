/** * User Management Page * 用户管理页面 */
<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NCard, NInput, NSpace } from 'naive-ui';
import { deleteUser, fetchUserList } from '@/service/api';
import UserSearch from './modules/user-search.vue';
import UserTable from './modules/user-table.vue';
import UserDetailModal from './modules/user-detail-modal.vue';
import UserStatusModal from './modules/user-status-modal.vue';
import FertilizerAdjustModal from './modules/fertilizer-adjust-modal.vue';
import FertilizeCountModal from './modules/fertilize-count-modal.vue';

defineOptions({
  name: 'ManagementUser'
});

// Loading state
const loading = ref(false);

// User list data
const userList = ref<Api.Admin.User.UserInfo[]>([]);

// Pagination
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
});

// Search params
const searchParams = ref({});

// Delete by ID
const deleteInputId = ref<string>('');

/**
 * Handle delete by input ID
 */
async function handleDeleteById() {
  if (!deleteInputId.value) {
    window.$message?.warning('请输入用户ID');
    return;
  }

  const id = Number(deleteInputId.value);
  if (Number.isNaN(id)) {
    window.$message?.warning('请输入有效的数字ID');
    return;
  }

  window.$dialog?.warning({
    title: '确认删除',
    content: `确定要删除用户 ID: ${id} 吗？此操作不可恢复！`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const { error } = await deleteUser(id);
        if (!error) {
          window.$message?.success('删除成功');
          deleteInputId.value = '';
          fetchData();
        }
      } catch {
        // Error is handled by request interceptor
      }
    }
  });
}

// Modals visibility
const detailModalVisible = ref(false);
const statusModalVisible = ref(false);
const fertilizerModalVisible = ref(false);
const fertilizeCountModalVisible = ref(false);

// Selected user
const selectedUserId = ref<number>(0);

/**
 * Fetch user list
 */
async function fetchData() {
  loading.value = true;
  try {
    const { data } = await fetchUserList({
      page: pagination.value.page,
      page_size: pagination.value.pageSize,
      ...searchParams.value
    });

    if (data) {
      userList.value = data.list;
      pagination.value.total = data.total;
    }
  } catch {
    // Error is handled by request interceptor
  } finally {
    loading.value = false;
  }
}

/**
 * Handle search
 */
function handleSearch(params: any) {
  searchParams.value = params;
  pagination.value.page = 1;
  fetchData();
}

/**
 * Handle page change
 */
function handlePageChange(page: number) {
  pagination.value.page = page;
  fetchData();
}

/**
 * Handle page size change
 */
function handlePageSizeChange(pageSize: number) {
  pagination.value.pageSize = pageSize;
  pagination.value.page = 1;
  fetchData();
}

/**
 * Handle view user detail
 */
function handleViewDetail(id: number) {
  selectedUserId.value = id;
  detailModalVisible.value = true;
}

/**
 * Handle update user status
 */
function handleUpdateStatus(id: number) {
  selectedUserId.value = id;
  statusModalVisible.value = true;
}

/**
 * Handle adjust fertilizer
 */
function handleAdjustFertilizer(id: number) {
  selectedUserId.value = id;
  fertilizerModalVisible.value = true;
}

/**
 * Handle update fertilize count
 */
function handleUpdateFertilizeCount(id: number) {
  selectedUserId.value = id;
  fertilizeCountModalVisible.value = true;
}

/**
 * Handle delete user
 */
async function handleDelete(id: number) {
  window.$dialog?.warning({
    title: '确认删除',
    content: '确定要删除该用户吗？此操作不可恢复！',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const { error } = await deleteUser(id);
        if (!error) {
          window.$message?.success('删除成功');
          fetchData();
        }
      } catch {
        // Error is handled by request interceptor
      }
    }
  });
}

/**
 * Handle modal success
 */
function handleModalSuccess() {
  fetchData();
}

// Initial fetch
fetchData();
</script>

<template>
  <NSpace vertical :size="16">
    <UserSearch @search="handleSearch" />

    <NCard :bordered="false" title="按ID删除用户">
      <NSpace align="center">
        <NInput v-model:value="deleteInputId" placeholder="请输入要删除的用户ID" class="delete-input" clearable />
        <NButton type="error" @click="handleDeleteById">删除用户</NButton>
      </NSpace>
    </NCard>

    <NCard :bordered="false" class="card-wrapper">
      <UserTable
        :loading="loading"
        :data="userList"
        :pagination="pagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        @view="handleViewDetail"
        @update-status="handleUpdateStatus"
        @adjust-fertilizer="handleAdjustFertilizer"
        @update-fertilize-count="handleUpdateFertilizeCount"
        @delete="handleDelete"
      />
    </NCard>

    <!-- User Detail Modal -->
    <UserDetailModal v-model:visible="detailModalVisible" :user-id="selectedUserId" />

    <!-- User Status Modal -->
    <UserStatusModal v-model:visible="statusModalVisible" :user-id="selectedUserId" @success="handleModalSuccess" />

    <!-- Fertilizer Adjust Modal -->
    <FertilizerAdjustModal
      v-model:visible="fertilizerModalVisible"
      :user-id="selectedUserId"
      @success="handleModalSuccess"
    />

    <!-- Fertilize Count Modal -->
    <FertilizeCountModal
      v-model:visible="fertilizeCountModalVisible"
      :user-id="selectedUserId"
      @success="handleModalSuccess"
    />
  </NSpace>
</template>

<style scoped>
.card-wrapper {
  min-height: 500px;
}

.delete-input {
  width: 200px;
}
</style>

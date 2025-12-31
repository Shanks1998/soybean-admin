/** * User Management Page * 用户管理页面 */
<script setup lang="ts">
import { ref } from 'vue';
import { NCard, NSpace } from 'naive-ui';
import { fetchUserList } from '@/service/api';
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
  } catch (error) {
    console.error('Failed to fetch user list:', error);
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
async function handleDelete(_id: number) {
  const confirmed = await window.$dialog?.warning({
    title: '确认删除',
    content: '确定要删除该用户吗？此操作不可恢复！',
    positiveText: '确定',
    negativeText: '取消'
  });

  if (!confirmed) return;

  // Note: Implement delete API call
  window.$message?.success('删除成功');
  fetchData();
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
</style>

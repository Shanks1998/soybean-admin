/** * Seed Management Page * 种子管理页面 */
<script setup lang="ts">
import { onActivated, ref } from 'vue';
import { NButton, NCard, NSpace } from 'naive-ui';
import { deleteSeed, fetchSeedList } from '@/service/api';
import SeedSearch from './modules/seed-search.vue';
import SeedTable from './modules/seed-table.vue';
import SeedOperateModal from './modules/seed-operate-modal.vue';
import SeedStatusModal from './modules/seed-status-modal.vue';

defineOptions({
  name: 'ManagementSeed'
});

// Loading state
const loading = ref(false);

// Seed list data
const seedList = ref<Api.Admin.Seed.SeedConfig[]>([]);

// Pagination
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
});

// Search params
const searchParams = ref({});

// Modals visibility
const operateModalVisible = ref(false);
const statusModalVisible = ref(false);

// Modal type and data
const modalType = ref<'add' | 'edit'>('add');
const selectedSeed = ref<Api.Admin.Seed.SeedConfig | null>(null);

/**
 * Fetch seed list
 */
async function fetchData() {
  loading.value = true;
  try {
    console.log('📋 [Seed List] ===== 开始获取种子列表 =====');
    console.log('🔹 当前页码:', pagination.value.page);
    console.log('🔹 每页数量:', pagination.value.pageSize);
    console.log('🔹 搜索参数:', searchParams.value);

    const { data } = await fetchSeedList({
      page: pagination.value.page,
      page_size: pagination.value.pageSize,
      ...searchParams.value
    });

    console.log('📦 [Seed List] ===== 收到数据 =====');
    console.log('🔹 完整返回对象:', { data });
    console.log('🔹 data 类型:', typeof data);
    console.log('🔹 data 是否为 null:', data === null);

    if (data) {
      console.log('🔹 data 的所有键:', Object.keys(data));
      console.log('🔹 data.code:', (data as any).code);
      console.log('🔹 data.message:', (data as any).message);
      console.log('🔹 data.data:', (data as any).data);
      console.log('🔹 直接访问 data.list:', data.list);
      console.log('🔹 直接访问 data.total:', data.total);
      console.log('🔹 嵌套访问 data.data?.list:', (data as any).data?.list);
      console.log('🔹 嵌套访问 data.data?.total:', (data as any).data?.total);

      console.log('🔹 完整 data 对象:', JSON.stringify(data, null, 2));

      seedList.value = data.list;
      pagination.value.total = data.total;

      console.log('✅ [Seed List] 数据已更新');
      console.log('🔹 seedList.value 长度:', seedList.value?.length);
      console.log('🔹 pagination.total:', pagination.value.total);
    } else {
      console.warn('⚠️ [Seed List] data 为空或 null');
    }
  } catch (error) {
    console.error('❌ [Seed List] 获取失败');
    console.error('🔹 错误对象:', error);
    console.error('Failed to fetch seed list:', error);
  } finally {
    loading.value = false;
    console.log('🏁 [Seed List] 请求完成，loading = false');
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
 * Handle add seed
 */
function handleAdd() {
  modalType.value = 'add';
  selectedSeed.value = null;
  operateModalVisible.value = true;
}

/**
 * Handle edit seed
 */
function handleEdit(record: Api.Admin.Seed.SeedConfig) {
  modalType.value = 'edit';
  selectedSeed.value = record;
  operateModalVisible.value = true;
}

/**
 * Handle update seed status
 */
function handleUpdateStatus(record: Api.Admin.Seed.SeedConfig) {
  selectedSeed.value = record;
  statusModalVisible.value = true;
}

/**
 * Handle delete seed
 */
async function handleDelete(id: number) {
  const confirmed = await window.$dialog?.warning({
    title: '确认删除',
    content: '确定要删除该种子吗？删除后将无法恢复！',
    positiveText: '确定',
    negativeText: '取消'
  });

  if (!confirmed) return;

  try {
    await deleteSeed(id);
    window.$message?.success('删除成功');
    fetchData();
  } catch (error) {
    console.error('Failed to delete seed:', error);
  }
}

/**
 * Handle sort change (drag and drop)
 */
async function handleSortChange(list: Api.Admin.Seed.SeedConfig[]) {
  seedList.value = list;
  // Note: Call API to update sort order
  window.$message?.info('排序已更新，请点击保存按钮保存排序');
}

/**
 * Handle modal success
 */
function handleModalSuccess() {
  fetchData();
}

/**
 * Handle component activated (when restored from keep-alive cache)
 */
onActivated(() => {
  // Refresh data when component is activated from cache
  fetchData();
});

// Initial fetch
fetchData();
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :bordered="false" class="card-wrapper">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold">种子配置管理</h3>
        <NButton type="primary" @click="handleAdd">
          <template #icon>
            <icon-mdi-plus />
          </template>
          新增种子
        </NButton>
      </div>

      <SeedSearch @search="handleSearch" />
    </NCard>

    <NCard :bordered="false" class="card-wrapper">
      <SeedTable
        :loading="loading"
        :data="seedList"
        :pagination="pagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        @edit="handleEdit"
        @update-status="handleUpdateStatus"
        @delete="handleDelete"
        @sort-change="handleSortChange"
      />
    </NCard>

    <!-- Seed Operate Modal (Add/Edit) -->
    <SeedOperateModal
      v-model:visible="operateModalVisible"
      :type="modalType"
      :edit-data="selectedSeed"
      @success="handleModalSuccess"
    />

    <!-- Seed Status Modal -->
    <SeedStatusModal v-model:visible="statusModalVisible" :seed="selectedSeed" @success="handleModalSuccess" />
  </NSpace>
</template>

<style scoped>
.card-wrapper {
  min-height: 200px;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.mb-4 {
  margin-bottom: 16px;
}

.text-lg {
  font-size: 1.125rem;
}

.font-semibold {
  font-weight: 600;
}
</style>

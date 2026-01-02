/** * Harvest Record Management Page * 收获记录管理页面 */
<script setup lang="ts">
import { onActivated, ref } from 'vue';
import { NCard, NSpace } from 'naive-ui';
import { fetchHarvestList } from '@/service/api';
import HarvestSearch from './modules/harvest-search.vue';
import HarvestTable from './modules/harvest-table.vue';
import HarvestDetailModal from './modules/harvest-detail-modal.vue';
import HarvestStatusModal from './modules/harvest-status-modal.vue';
import TrackingNoModal from './modules/tracking-no-modal.vue';

defineOptions({
  name: 'ManagementHarvest'
});

// Loading state
const loading = ref(false);

// Harvest list data
const harvestList = ref<Api.Admin.Harvest.HarvestRecord[]>([]);

// Pagination
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
});

// Search params
const searchParams = ref({});

// Modal states
const detailModalVisible = ref(false);
const statusModalVisible = ref(false);
const trackingModalVisible = ref(false);

// Selected record
const selectedRecord = ref<Api.Admin.Harvest.HarvestRecord | null>(null);

/**
 * Fetch harvest list
 */
async function fetchData() {
  loading.value = true;
  try {
    const { data } = await fetchHarvestList({
      page: pagination.value.page,
      page_size: pagination.value.pageSize,
      ...searchParams.value
    });

    if (data) {
      harvestList.value = data.records;
      pagination.value.total = data.total;
    }
  } catch (error) {
    console.error('Failed to fetch harvest list:', error);
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
 * Handle view detail
 */
function handleViewDetail(record: Api.Admin.Harvest.HarvestRecord) {
  selectedRecord.value = record;
  detailModalVisible.value = true;
}

/**
 * Handle update status
 */
function handleUpdateStatus(record: Api.Admin.Harvest.HarvestRecord) {
  selectedRecord.value = record;
  statusModalVisible.value = true;
}

/**
 * Handle update tracking number
 */
function handleUpdateTracking(record: Api.Admin.Harvest.HarvestRecord) {
  selectedRecord.value = record;
  trackingModalVisible.value = true;
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
    <HarvestSearch @search="handleSearch" />

    <NCard :bordered="false" class="card-wrapper">
      <HarvestTable
        :loading="loading"
        :data="harvestList"
        :pagination="pagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        @view="handleViewDetail"
        @update-status="handleUpdateStatus"
        @update-tracking="handleUpdateTracking"
      />
    </NCard>

    <!-- Harvest Detail Modal -->
    <HarvestDetailModal v-model:visible="detailModalVisible" :record="selectedRecord" />

    <!-- Harvest Status Modal -->
    <HarvestStatusModal v-model:visible="statusModalVisible" :record="selectedRecord" @success="handleModalSuccess" />

    <!-- Tracking Number Modal -->
    <TrackingNoModal v-model:visible="trackingModalVisible" :record="selectedRecord" @success="handleModalSuccess" />
  </NSpace>
</template>

<style scoped>
.card-wrapper {
  min-height: 500px;
}
</style>

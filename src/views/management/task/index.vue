/** * Task Management Page * 任务配置管理页面 */
<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NCard, NSpace } from 'naive-ui';
import { deleteTask, fetchTaskList } from '@/service/api';
import TaskSearch from './modules/task-search.vue';
import TaskTable from './modules/task-table.vue';
import TaskOperateModal from './modules/task-operate-modal.vue';

defineOptions({
  name: 'ManagementTask'
});

// Loading state
const loading = ref(false);

// Task list data
const taskList = ref<Api.Admin.Task.TaskConfig[]>([]);

// Pagination
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
});

// Search params
const searchParams = ref({});

// Modal state
const operateModalVisible = ref(false);
const modalType = ref<'add' | 'edit'>('add');
const selectedTask = ref<Api.Admin.Task.TaskConfig | null>(null);

/**
 * Fetch task list
 */
async function fetchData() {
  loading.value = true;
  try {
    const { data } = await fetchTaskList({
      page: pagination.value.page,
      page_size: pagination.value.pageSize,
      ...searchParams.value
    });

    if (data) {
      taskList.value = data.list;
      pagination.value.total = data.total;
    }
  } catch {
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
 * Handle add task
 */
function handleAdd() {
  modalType.value = 'add';
  selectedTask.value = null;
  operateModalVisible.value = true;
}

/**
 * Handle edit task
 */
function handleEdit(record: Api.Admin.Task.TaskConfig) {
  modalType.value = 'edit';
  selectedTask.value = record;
  operateModalVisible.value = true;
}

/**
 * Handle delete task
 */
async function handleDelete(id: number) {
  window.$dialog?.warning({
    title: '确认删除',
    content: '确定要删除该任务吗？删除后将无法恢复！',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const { error } = await deleteTask(id);
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
    <NCard :bordered="false" class="card-wrapper">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold">任务配置管理</h3>
        <NButton type="primary" @click="handleAdd">
          <template #icon>
            <icon-mdi-plus />
          </template>
          新增任务
        </NButton>
      </div>

      <TaskSearch @search="handleSearch" />
    </NCard>

    <NCard :bordered="false" class="card-wrapper">
      <TaskTable
        :loading="loading"
        :data="taskList"
        :pagination="pagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </NCard>

    <!-- Task Operate Modal (Add/Edit) -->
    <TaskOperateModal
      v-model:visible="operateModalVisible"
      :type="modalType"
      :edit-data="selectedTask"
      @success="handleModalSuccess"
    />
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

/** * Order Repair Management Page * 订单补单管理页面 */
<script setup lang="ts">
import { ref } from 'vue';
import { NAlert, NButton, NCard, NSpace } from 'naive-ui';
import RepairPayModal from './modules/repair-pay-modal.vue';
import RepairCancelModal from './modules/repair-cancel-modal.vue';

defineOptions({
  name: 'ManagementOrder'
});

// Modal states
const repairPayModalVisible = ref(false);
const repairCancelModalVisible = ref(false);

/**
 * Handle open repair pay modal
 */
function handleOpenRepairPay() {
  repairPayModalVisible.value = true;
}

/**
 * Handle open repair cancel modal
 */
function handleOpenRepairCancel() {
  repairCancelModalVisible.value = true;
}
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :bordered="false">
      <NAlert type="warning" title="订单补单说明" closable>
        此功能用于手动触发订单的支付或取消逻辑，请谨慎操作！
        <ul class="mt-2">
          <li>
            <strong>补单支付：</strong>
            强制触发订单支付成功的业务逻辑，用于支付回调异常等场景
          </li>
          <li>
            <strong>补单取消：</strong>
            强制触发订单取消的业务逻辑，用于取消回调异常等场景
          </li>
        </ul>
      </NAlert>
    </NCard>

    <NCard :bordered="false" title="订单补单操作">
      <NSpace vertical :size="16">
        <div class="operation-card">
          <div class="operation-header">
            <icon-mdi-cash-check class="operation-icon success" />
            <div class="operation-info">
              <h3 class="operation-title">补单支付</h3>
              <p class="operation-desc">手动触发订单支付成功逻辑，适用于支付回调失败或延迟的情况</p>
            </div>
          </div>
          <NButton type="success" size="large" @click="handleOpenRepairPay">
            <template #icon>
              <icon-mdi-play-circle />
            </template>
            执行补单支付
          </NButton>
        </div>

        <div class="operation-card">
          <div class="operation-header">
            <icon-mdi-close-circle class="operation-icon error" />
            <div class="operation-info">
              <h3 class="operation-title">补单取消</h3>
              <p class="operation-desc">手动触发订单取消逻辑，适用于取消回调失败或需要强制取消的情况</p>
            </div>
          </div>
          <NButton type="error" size="large" @click="handleOpenRepairCancel">
            <template #icon>
              <icon-mdi-play-circle />
            </template>
            执行补单取消
          </NButton>
        </div>
      </NSpace>
    </NCard>

    <!-- Repair Pay Modal -->
    <RepairPayModal v-model:visible="repairPayModalVisible" />

    <!-- Repair Cancel Modal -->
    <RepairCancelModal v-model:visible="repairCancelModalVisible" />
  </NSpace>
</template>

<style scoped>
.mt-2 {
  margin-top: 8px;
}

.operation-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  transition: all 0.3s;
}

.operation-card:hover {
  border-color: var(--n-primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.operation-header {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.operation-icon {
  font-size: 48px;
}

.operation-icon.success {
  color: var(--n-success-color);
}

.operation-icon.error {
  color: var(--n-error-color);
}

.operation-info {
  flex: 1;
}

.operation-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.operation-desc {
  margin: 0;
  color: var(--n-text-color-2);
  font-size: 14px;
}
</style>

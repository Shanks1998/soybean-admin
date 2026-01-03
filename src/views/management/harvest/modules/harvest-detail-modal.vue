/** * Harvest Detail Modal Component * 收获记录详情弹窗组件 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { NCard, NDescriptions, NDescriptionsItem, NModal, NSpin, NTag } from 'naive-ui';
import { HARVEST_STATUS_MAP } from '@/constants/business';
import { fetchHarvestDetail } from '@/service/api';
import { formatDateTime } from '@/utils/format';

interface Props {
  visible: boolean;
  record: Api.Admin.Harvest.HarvestRecord | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const loading = ref(false);
const detailData = ref<Api.Admin.Harvest.HarvestRecord | null>(null);

/**
 * Fetch harvest detail
 */
async function fetchData() {
  if (!props.record) return;

  loading.value = true;
  try {
    const { data } = await fetchHarvestDetail(props.record.id);
    if (data) {
      detailData.value = data;
    }
  } catch {
  } finally {
    loading.value = false;
  }
}

/**
 * Handle close
 */
function handleClose() {
  emit('update:visible', false);
}

// Watch visible change
watch(
  () => props.visible,
  val => {
    if (val) {
      fetchData();
    } else {
      detailData.value = null;
    }
  }
);
</script>

<template>
  <NModal :show="visible" preset="card" title="收获记录详情" class="w-800px" @update:show="handleClose">
    <NSpin :show="loading">
      <div v-if="detailData" class="harvest-detail">
        <!-- Basic Info -->
        <NCard title="基本信息" :bordered="false" class="detail-section">
          <NDescriptions :column="2" label-placement="left">
            <NDescriptionsItem label="记录ID">
              {{ detailData.id }}
            </NDescriptionsItem>
            <NDescriptionsItem label="用户ID">
              {{ detailData.user_id }}
            </NDescriptionsItem>
            <NDescriptionsItem label="状态">
              <NTag :type="HARVEST_STATUS_MAP[detailData.status].type">
                {{ HARVEST_STATUS_MAP[detailData.status].label }}
              </NTag>
            </NDescriptionsItem>
            <NDescriptionsItem label="创建时间">
              {{ formatDateTime(detailData.created_at) }}
            </NDescriptionsItem>
            <NDescriptionsItem label="更新时间">
              {{ formatDateTime(detailData.updated_at) }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>

        <!-- Recipient Info -->
        <NCard title="收货信息" :bordered="false" class="detail-section">
          <NDescriptions :column="2" label-placement="left">
            <NDescriptionsItem label="收货人">
              {{ detailData.address_data.name }}
            </NDescriptionsItem>
            <NDescriptionsItem label="联系电话">
              {{ detailData.address_data.phone }}
            </NDescriptionsItem>
            <NDescriptionsItem label="省份">
              {{ detailData.address_data.province }}{{ detailData.address_data.city
              }}{{ detailData.address_data.district }} {{ detailData.address_data.detail }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>

        <!-- Seed Info -->
        <NCard title="种子信息" :bordered="false" class="detail-section">
          <NDescriptions :column="2" label-placement="left">
            <NDescriptionsItem label="种子名称">
              {{ detailData.seed_data.name }}
            </NDescriptionsItem>
            <NDescriptionsItem label="奖励类型">
              {{ detailData.seed_data.reward_type }}
            </NDescriptionsItem>
            <NDescriptionsItem v-if="detailData.seed_data.shop_sku_id" label="商品SKU">
              {{ detailData.seed_data.shop_sku_id }}
            </NDescriptionsItem>
            <NDescriptionsItem v-if="detailData.seed_data.coupon_id" label="优惠券ID">
              {{ detailData.seed_data.coupon_id }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>

        <!-- Logistics Info -->
        <NCard v-if="detailData.tracking_no" title="物流信息" :bordered="false" class="detail-section">
          <NDescriptions :column="2" label-placement="left">
            <NDescriptionsItem label="快递单号">
              {{ detailData.tracking_no }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>
      </div>
    </NSpin>
  </NModal>
</template>

<style scoped>
.harvest-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 16px;
}

.detail-section:last-child {
  margin-bottom: 0;
}
</style>

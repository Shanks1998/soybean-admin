/** * User Detail Modal Component * 用户详情弹窗组件 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { NAvatar, NCard, NDescriptions, NDescriptionsItem, NModal, NSpin, NTag } from 'naive-ui';
import { USER_STATUS_MAP } from '@/constants/business';
import { fetchUserDetail } from '@/service/api';
import { formatDateTime, maskSensitive } from '@/utils/format';

interface Props {
  visible: boolean;
  userId: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const loading = ref(false);
const userDetail = ref<Api.Admin.User.UserDetail | null>(null);

/**
 * Fetch user detail
 */
async function fetchData() {
  if (!props.userId) return;

  loading.value = true;
  try {
    const { data } = await fetchUserDetail(props.userId);
    if (data) {
      userDetail.value = data;
    }
  } catch {
  } finally {
    loading.value = false;
  }
}

/**
 * Handle modal close
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
      userDetail.value = null;
    }
  }
);
</script>

<template>
  <NModal :show="visible" preset="card" title="用户详情" class="w-800px" @update:show="handleClose">
    <NSpin :show="loading">
      <div v-if="userDetail" class="user-detail">
        <!-- Basic Info -->
        <NCard title="基本信息" :bordered="false" class="detail-section">
          <NDescriptions :column="2" label-placement="left">
            <NDescriptionsItem label="用户ID">
              {{ userDetail.user.id }}
            </NDescriptionsItem>
            <NDescriptionsItem label="状态">
              <NTag :type="USER_STATUS_MAP[userDetail.user.status].type">
                {{ USER_STATUS_MAP[userDetail.user.status].label }}
              </NTag>
            </NDescriptionsItem>
            <NDescriptionsItem label="头像">
              <NAvatar :src="userDetail.user.avatar_url" :size="60" round />
            </NDescriptionsItem>
            <NDescriptionsItem label="昵称">
              {{ userDetail.user.nickname }}
            </NDescriptionsItem>
            <NDescriptionsItem label="注册时间">
              {{ formatDateTime(userDetail.user.created_at) }}
            </NDescriptionsItem>
            <NDescriptionsItem label="最后登录">
              {{ formatDateTime(userDetail.user.last_login_at) }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>

        <!-- Game State -->
        <NCard title="游戏状态" :bordered="false" class="detail-section">
          <NDescriptions :column="2" label-placement="left">
            <NDescriptionsItem label="果树等级">
              {{ userDetail.game_state.level }}
            </NDescriptionsItem>
            <NDescriptionsItem label="当前成长值">
              {{ userDetail.game_state.growth }}
            </NDescriptionsItem>
            <NDescriptionsItem label="累计成长值">
              {{ userDetail.game_state.total_growth }}
            </NDescriptionsItem>
            <NDescriptionsItem label="肥料数量">
              {{ userDetail.game_state.fertilizer_amount }}
            </NDescriptionsItem>
            <NDescriptionsItem label="每日最大施肥次数">
              {{ userDetail.game_state.max_daily_fertilize_count }}
            </NDescriptionsItem>
            <NDescriptionsItem label="当前种子ID">
              {{ userDetail.game_state.current_seed_id || '-' }}
            </NDescriptionsItem>
            <NDescriptionsItem label="当前轮次ID">
              {{ userDetail.game_state.current_round_id || '-' }}
            </NDescriptionsItem>
            <NDescriptionsItem label="可收获">
              <NTag :type="userDetail.game_state.can_harvest ? 'success' : 'default'">
                {{ userDetail.game_state.can_harvest ? '是' : '否' }}
              </NTag>
            </NDescriptionsItem>
            <NDescriptionsItem label="已收获">
              <NTag :type="userDetail.game_state.is_harvested ? 'success' : 'default'">
                {{ userDetail.game_state.is_harvested ? '是' : '否' }}
              </NTag>
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>

        <!-- Third Party Login -->
        <NCard
          v-if="userDetail.identities && userDetail.identities.length > 0"
          title="第三方登录信息"
          :bordered="false"
          class="detail-section"
        >
          <NDescriptions
            v-for="(identity, index) in userDetail.identities"
            :key="index"
            :column="2"
            label-placement="left"
            class="identity-item"
          >
            <NDescriptionsItem label="登录类型">
              {{ identity.identity_type }}
            </NDescriptionsItem>
            <NDescriptionsItem label="OpenID">
              {{ maskSensitive(identity.open_id, { start: 6, end: 6 }) }}
            </NDescriptionsItem>
            <NDescriptionsItem label="UnionID">
              {{ identity.union_id ? maskSensitive(identity.union_id, { start: 6, end: 6 }) : '-' }}
            </NDescriptionsItem>
            <NDescriptionsItem label="绑定时间">
              {{ formatDateTime(identity.created_at) }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>
      </div>
    </NSpin>
  </NModal>
</template>

<style scoped>
.user-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 16px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.identity-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--n-border-color);
}

.identity-item:last-child {
  border-bottom: none;
}
</style>

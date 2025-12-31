/**
 * Admin Task Management API
 * 任务管理相关 API
 */

import { adminRequest } from '../request/admin';

/**
 * Get task list with pagination
 * 获取任务列表（分页）
 * @param params - Pagination params
 */
export function fetchTaskList(params: Api.Admin.Task.TaskListParams) {
  return adminRequest<Api.Admin.Task.TaskListResponse>({
    url: '/tasks',
    method: 'get',
    params
  });
}

/**
 * Get task detail by ID
 * 获取任务详情
 * @param id - Task ID
 */
export function fetchTaskDetail(id: number) {
  return adminRequest<Api.Admin.Task.TaskConfig>({
    url: `/tasks/${id}`,
    method: 'get'
  });
}

/**
 * Create task
 * 创建任务
 * @param data - Create task request
 */
export function createTask(data: Api.Admin.Task.CreateTaskRequest) {
  return adminRequest<Api.Admin.Task.TaskConfig>({
    url: '/tasks',
    method: 'post',
    data
  });
}

/**
 * Update task
 * 更新任务
 * @param id - Task ID
 * @param data - Update task request
 */
export function updateTask(id: number, data: Api.Admin.Task.UpdateTaskRequest) {
  return adminRequest({
    url: `/tasks/${id}`,
    method: 'put',
    data
  });
}

/**
 * Delete task
 * 删除任务
 * @param id - Task ID
 */
export function deleteTask(id: number) {
  return adminRequest({
    url: `/tasks/${id}`,
    method: 'delete'
  });
}

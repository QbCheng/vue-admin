import request from '@/utils/request'

export function getUserRoleList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

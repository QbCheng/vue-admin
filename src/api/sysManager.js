import request from '@/utils/request'

// 用户管理api
export function getUserList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

// 获取列表
export function getUserList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

// 更新
export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

// 删除
export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

// 创建
export function createUser(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

// 用户拥有的权限
export function userHasPermission(data) {
  return request({
    url: '/rbac/userHasPermission',
    method: 'post',
    data
  })
}

// 用户拥有的角色
export function userHasRole(data) {
  return request({
    url: '/rbac/userHasRole',
    method: 'post',
    data
  })
}

// 用户拥有的所有权限
export function userHasAllPermission(data) {
  return request({
    url: '/rbac/userHasAllPermission',
    method: 'post',
    data
  })
}

// 给用户挂载权
export function userAssignPermission(data) {
  return request({
    url: '/rbac/userAssignPermission',
    method: 'post',
    data
  })
}

// 给用户挂载角色
export function userAssignRole(data) {
  return request({
    url: '/rbac/userAssignRole',
    method: 'post',
    data
  })
}

// 给用户卸载角色
export function userUnassignRole(data) {
  return request({
    url: '/rbac/userUnassignRole',
    method: 'post',
    data
  })
}

// ---------------------------------- rbac 权限--------------------
// 获取列表
export function getPermissionList(data) {
  return request({
    url: '/rbac/permissionList',
    method: 'post',
    data
  })
}

// 更新
export function updatePermission(data) {
  return request({
    url: '/rbac/updatePermission',
    method: 'post',
    data
  })
}

// 删除
export function delPermission(data) {
  return request({
    url: '/rbac/delPermission',
    method: 'post',
    data
  })
}

// 创建
export function createPermission(data) {
  return request({
    url: '/rbac/createPermission',
    method: 'post',
    data
  })
}

// ---------------------------------- rbac 权限组--------------------
// 获取列表
export function getRoleList(data) {
  return request({
    url: '/rbac/roleList',
    method: 'post',
    data
  })
}

// 更新
export function updateRole(data) {
  return request({
    url: '/rbac/updateRole',
    method: 'post',
    data
  })
}

// 删除
export function delRole(data) {
  return request({
    url: '/rbac/delRole',
    method: 'post',
    data
  })
}

// 创建
export function createRole(data) {
  return request({
    url: '/rbac/createRole',
    method: 'post',
    data
  })
}

// 角色装载权限
export function roleAssignPermission(data) {
  return request({
    url: '/rbac/roleAssignPermission',
    method: 'post',
    data
  })
}

// 角色卸载权限
export function roleUnassignPermission(data) {
  return request({
    url: '/rbac/roleUnassignPermission',
    method: 'post',
    data
  })
}

// 角色拥有的权限
export function roleHasPermission(data) {
  return request({
    url: '/rbac/roleHasPermission',
    method: 'post',
    data
  })
}


<template>
  <el-dialog
    title="角色分配权限"
    :visible.sync="visible"
    :show="show"
    :optid="optid"
    center
    @close="closeCallback"
    @open="openCallback"
  >
    <div style="text-align: center">
      <el-transfer
        v-model="rightData"
        style="text-align: left; display: inline-block"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入权限名"
        :data="data"
        :titles="['未拥有的权限', '已拥有的权限']"
        @change="changeCallBack"
      />
    </div>
  </el-dialog>
</template>

<script>
import { getPermissionList, roleAssignPermission, roleUnassignPermission, roleHasPermission } from '@/api/sysManager'
import axios from 'axios'

export default {
  // 弹出框
  name: 'AllocateDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    // 当前的用户
    optid: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      data: [],
      rightData: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      visible: this.show
    }
  },

  watch: {
    show() {
      this.visible = this.show
    }
  },

  methods: {
    // 当弹出框关闭时回调
    closeCallback() {
      this.$emit('update:show', false)
      this.$emit('update:optid', -1)
      this.rightData = []
      this.data = []
    },
    // 当弹出框打开时回调
    openCallback() {
      axios.all([getPermissionList({
        page: 1,
        limit: 999,
        id: '',
        name: ''
      }),
      roleHasPermission({
        roleId: this.optid
      })
      ]).then(response => {
        if (!response) {
          return
        }
        console.log(response)
        this.generateData(response[0].data, response[1].data)
      })
    },
    // 元素发生改变的回调(数据左右移动的回调)
    changeCallBack(value, direction, movedKeys) {
      // 向右移动 绑定权限
      if (direction === 'right') {
        this.assignPermission(movedKeys)
      } else {
        // 解除权限绑定
        this.unassignPermission(movedKeys)
      }
    },

    // 生成数据
    generateData(allData, roleData) {
      let allPermissions = []
      if (allData && allData.list) {
        allPermissions = allData.list
      }
      let rolePermissions = []
      if (roleData && roleData.list) {
        rolePermissions = roleData.list
      }
      // 处理用户参数
      rolePermissions.forEach((value, key) => {
        // 处理右边方框数据
        this.rightData.push(value.id)
      })
      allPermissions.forEach((value, key) => {
        this.data.push({
          label: value.name,
          key: value.id
        })
      })
    },

    // 装载权限
    assignPermission(movedKeys) {
      roleAssignPermission({
        roleId: this.optid,
        permissionIdList: movedKeys
      }).then(response => {
        if (!response) {
          return
        }
        console.log(response)
        if (response.code !== 0) {
          console.log('权限装载不成功')
        }
        console.log('权限添加成功')
      })
    },

    // 卸载当前的权限
    unassignPermission(movedKeys) {
      roleUnassignPermission({
        roleId: this.optid,
        permissionIdList: movedKeys
      }).then(response => {
        if (!response) {
          return
        }
        console.log(response)
        if (response.code !== 0) {
          console.log('权限卸载不成功')
        }
        console.log('权限卸载成功')
      })
    },

    // 获得当前用户的权限
    getRoleHasPermission() {
      roleHasPermission({
        roleId: this.optid
      }).then(response => {
        if (!response) {
          return
        }
        console.log(response)
        if (response.code !== 0) {
          console.log('获取角色权限失败')
        }
        console.log('获取角色权限成功')
      })
    }
  }
}
</script>

<style>

</style>


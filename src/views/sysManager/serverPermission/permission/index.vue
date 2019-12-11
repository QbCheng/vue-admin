<template>
  <el-table
    ref="multipleTable"
    :data="tableData"
    height="250"
    highlight-current-row
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    >
    <el-table-column
      type="selection"
      width="55"
    />
    <el-table-column
      prop="name"
      label="权限名"
    />
    <el-table-column
      prop="guard_name"
      label="守卫名"
    />
    <el-table-column
      prop="created_at"
      label="创建时间"
    />
    <el-table-column
      prop="updated_at"
      label="更新时间"
    />
    <el-table-column
      fixed="right"
      label="操作"
      width="100"
    >
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
        <el-button type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getUserRoleList } from '@/api/sysManager'

export default {
  data() {
    return {
      tableData: null,
      tableLoading: true,
      multipleSelection: [] // 保存选择项
    }
  },
  methods: {
    fetchData() {
      this.tableLoading = true
      getUserRoleList().then(response => {
        this.tableLoading = false
      })
    },
    // selection-change	当选择项发生变化时会触发该事件(包括全选)
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

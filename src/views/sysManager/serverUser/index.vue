<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.account" placeholder="账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
    </div>

    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55px" />
      <el-table-column prop="account" label="账号" width="150px" />
      <el-table-column prop="password" label="密码" width="150px" />
      <el-table-column prop="created_at" label="创建时间" width="200px" />
      <el-table-column prop="updated_at" label="更新时间" width="200px" />
      <el-table-column prop="avatar" label="头像地址" width="300px" />
      <el-table-column prop="introduction" label="用户简介" />

      <el-table-column fixed="right" label="操作" width="100px">
        <!-- --TODO: scope 是保存el-table数据的行内数据结构 -->
        <template v-slot="{row}">
          <el-button type="text" size="small" @click="handleClick(row)">查看</el-button>
          <el-button type="text" size="small" @click="handleUpdate(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />

    <!-- 编辑，创建弹出框 -->
    <el-dialog :title="textMap[fromDialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="fromTempData" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item label="账号" prop="account">
          <el-input v-model="fromTempData.account" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="fromTempData.password" />
        </el-form-item>
        <el-form-item label="用户简介" prop="introduction">
          <el-input v-model="fromTempData.introduction" />
        </el-form-item>
        <el-form-item label="头像地址" prop="avatar">
          <el-input v-model="fromTempData.avatar" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="fromDialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList } from '@/api/sysManager'

import Pagination from '@/components/Pagination' // 分页组件

export default {
  components: {
    Pagination
  },
  data() {
    return {
      tableData: null, // 绑定表单数据
      tableLoading: false, // 是否在加载的标识
      multipleSelection: [], // 保存选择项

      // 分页数据
      total: 0,

      // listQuery参数
      listQuery: {
        page: 1,
        limit: 20,
        account: ''
      },

      // 创建 和 编辑 对话框
      dialogFormVisible: false,

      fromDialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      // from  :rules="rules" 校验规则参见 async-validator
      rules: {
        account: [{ required: true, message: 'account is required', trigger: 'change' }],
        password: [{ required: true, message: 'password is required', trigger: 'change' }]
      },
      // 表单数据做数据绑定
      fromTempData: {
        account: '',
        password: '',
        introduction: '',
        avatar: ''
      }

    }
  },

  // 钩子函数，用来初始化数据( 当调用的时间过长，则会造成较长的白屏时间 )
  created() {
    this.fetchData()
  },

  methods: {
    // 数据加载
    fetchData() {
      this.tableLoading = true
      getUserList(this.listQuery).then(response => {
        // 获取表格数据
        this.tableData = response.data.list
        this.tableLoading = false
        console.log(response.data)
        // 给分页数据复制
        this.total = response.data.totalNum
      })
    },

    // 过滤请求
    handleFilter() {
      // 从第一页重新加载
      this.listQuery.page = 1
      this.fetchData()
    },

    // 对话框弹出
    handleUpdate(row) {
      this.fromTempData = Object.assign({}, row) // copy obj
      this.fromDialogStatus = 'update'
      console.log(this.fromTempData)
      this.dialogFormVisible = true
      console.log(this.$refs)
      console.log(this.$refs['dataForm'])
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    handleClick(row) {
      console.log(row)
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    createData() {

    },

    updateData() {

    }
  }
}
</script>

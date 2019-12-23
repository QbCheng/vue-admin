<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.account" placeholder="账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建
      </el-button>
      <el-popconfirm
        title="确定批量删除吗?"
        @onConfirm="delMuitlData"
      >
        <el-button slot="reference" class="filter-item" style="margin-left: 10px;" icon="el-icon-edit" type="primary"> 批量删除 </el-button>
      </el-popconfirm></div>

    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40px" />
      <el-table-column prop="name" label="姓名" width="100px" />
      <el-table-column prop="account" label="账号" width="150px" />
      <el-table-column prop="password" label="密码" width="150px" />
      <el-table-column prop="createdAt" label="创建时间" width="180px" :formatter="formatterDate" />
      <el-table-column prop="updatedAt" label="更新时间" width="180px" :formatter="formatterDate" />
      <el-table-column prop="avatar" label="头像地址" width="300px" />
      <el-table-column prop="introduction" label="用户简介" />

      <el-table-column fixed="right" label="操作" width="100px">
        <!-- --TODO: scope 是保存el-table数据的行内数据结构 -->
        <template v-slot="{row}">
          <el-button type="text" size="small" @click="handleUpdate(row)">编辑</el-button>
          <el-popconfirm
            title="确定批量删除吗?"
            @onConfirm="handleDelete(row)"
          >
            <el-button slot="reference" type="text" size="small">删除</el-button>
          </el-popconfirm>
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="fromTempData.name" />
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
import { getUserList, updateUser, deleteUser, createUser } from '@/api/sysManager'
import { parseTime } from '@/utils'

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
        account: '',
        name: ''
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
        avatar: '',
        name: ''
      },

      // 重新获取table数据
      refresh: 0

    }
  },

  // 计算属性
  computed: {
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
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 单独删除用户
    handleDelete(row) {
      const { account } = row
      console.log('handleDelete')
      deleteUser({ account: [account] }).then(response => {
        this.fetchData()
      })
    },

    // 弹出创建页面
    handleCreate() {
      this.fromTempData = {
        account: '',
        password: '',
        introduction: '',
        avatar: ''
      }
      this.fromDialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 创建用户数据
    createData() {
      createUser(this.fromTempData).then(response => {
        this.dialogFormVisible = false
        this.fetchData()
      })
    },

    // 批量删除
    delMuitlData() {
      const parameter = []
      if (!this.multipleSelection || this.multipleSelection.length === 0) {
        return
      }
      this.multipleSelection.forEach(Element => {
        parameter.push(Element.account)
      })
      deleteUser({ account: parameter }).then(response => {
        this.fetchData()
      })
    },

    // 更新用户数据
    updateData() {
      updateUser(this.fromTempData).then(response => {
        this.dialogFormVisible = false
        this.fetchData()
      })
    },

    // 格式化日期
    formatterDate(row, column) {
      const property = column.property
      return parseTime(row[property])
    }
  }
}
</script>

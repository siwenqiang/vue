<template>
  <!-- // 卡片的组件 -->
  <el-card class="box-card">
    <!-- 面包屑组件 -->
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>
    <!-- /搜索框和按钮 -->
    <el-row>
      <el-col>
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="input-with-select"
          clearable
          @clear="clearInput()"
        >
          <el-button slot="append" icon="el-icon-search" @click.prevent="searchUser()"></el-button>
        </el-input>

        <el-button type="primary" @click="showAddUser()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="#" width="180"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="create_time" label="创建日期">
        <!-- 如果表格内容不是简单的字符串就需要用tempalte
          list会自动锁定tabledata list有一个属性row 对应的是数组list中的每一个对象
        list.create_time来访问对应的数据
        -->
        <template slot-scope="list">{{list.row.create_time | formdate}}</template>
      </el-table-column>
      <el-table-column prop="address" label="用户状态">
        <template slot-scope="list">
          <el-switch
            @change="changeUserState(list.row)"
            v-model="list.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="list">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
            @click="showEdit(list.row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
            @click="showCurrRole(list.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
            @click="deleteConfirm(list.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- 
  handleSizeChange:每页显示条数改变时
  handleCurrentChange:当前页码改变时
  current-page:当前页码
  page-sizes:控制每页显示条数所在的数组
  layout:分页组件的小功能
  total:数据总个数
    -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8,10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!--添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑页面对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!--分配用户角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">{{this.currUserName}}</el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <!-- 当select绑定的数据和option中的value值一样时，则会显示这个option
    如果选择了某个option则，select绑定的数据就是该option的value值
          -->
          <el-select v-model="currUserRoleId" placeholder="请选择活动区域">
            <el-option label="请选择" :value="-1"></el-option>
            <!-- v-for遍历 -->
            <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "100px",
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      currUserRoleId: -1,
      roles: [],
      currUserName: "",
      currUserId:-1
    };
  },
  created() {
    this.getTabledata();
  },
  methods: {
    async getTabledata() {
      //根据接口文档的（需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌）
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );

      //用对象的解构赋值来获取返回数据中需要的内容
      const {
        data: {
          data: { total, users },
          meta: { msg, status }
        }
      } = res;
      if (status === 200) {
        this.tableData = users;
        this.total = total;
        // this.$message.success(msg)
        //拿到的是当前分页内所有用户的数据
        // console.log(users);
      }
    },
    //当每页显示条数改变时
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getTabledata();
      // console.log(`每页 ${val} 条`);
    },
    //当前页码数改变时
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getTabledata();
      // console.log(`当前页: ${val}`);
    },
    //搜索框搜索功能
    //这里ui组件，不用自己写搜索功能么？
    searchUser() {
      this.pagenum = 1;
      this.getTabledata();
    },
    //点击清空按钮时，重新获取数据
    clearInput() {
      this.getTabledata();
    },
    //点击添加用户提示弹出层
    showAddUser() {
      //在显示弹出层之前将表单数据清空
      this.form = {};
      //显示弹出层
      this.dialogFormVisibleAdd = true;
    },
    //实现点击确定添加用户功能
    async addUser() {
      //发送请求
      const res = await this.$http.post("users", this.form);
      //对象的解构赋值
      const {
        data: {
          meta: { msg, status }
        }
      } = res;
      if (status === 201) {
        this.$message.success(msg);
        //刷新页面
        this.getTabledata();
        //关闭弹出层
        this.dialogFormVisibleAdd = false;
      } else {
        this.$message.warning(msg);
      }
    },
    //删除功能
    deleteConfirm(users) {
      //如果点击了取消则来到catch方法，如果点击确定则来到then方法
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${users.id}`);
          // console.log(res);
          const {
            data: {
              data,
              meta: { status, msg }
            }
          } = res;

          if (status === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.pagenum = 1;
            this.getTabledata();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //渲染编辑表单组件并将当前用户信息填在表单中
    showEdit(user) {
      // console.log(user)
      this.dialogFormVisibleEdit = true;
      //编辑用户页面打开时，将用户信息赋值给form对象
      this.form = user;
    },
    //完成提交编辑用户的功能
    async editUser() {
      //发送编辑表单的请求
      const res = await this.$http.put(`users/${this.form.id}`, {
        email: this.form.email,
        mobile: this.form.mobile
      });
      // console.log(res)
      const {
        data: {
          meta: { status, msg }
        }
      } = res;
      if (status === 200) {
        this.$message.success(msg);
        this.dialogFormVisibleEdit = false;
      }
    },
    //完成修改用户状态功能
    async changeUserState(user) {
      // console.log(user)
      //发送axios请求
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
    },
    //渲染 分配角色的对话框
    async showCurrRole(user) {
      // user是点击对号的当前的用户信息
      // console.log(user);
      this.currUserName = user.username;
      
      this.dialogFormVisibleRole = true;
      //发送axios请求获取用户角色
      const res = await this.$http.get("roles");
      this.roles = res.data.data;
      // roles中是所有角色对应的ID值
      // console.log(res);
      //发送axios请求获取用户角色对应的ID
      const res2 = await this.$http.get(`users/${user.id}`);
      // console.log(res2);

      this.currUserRoleId = res2.data.data.rid;
      //此处因为发送更改用户角色的请求需要当前角色的id，但点击确定按钮不在template中，所以无法
      //传参获取，只能通过在data中声明一个变量，当获取分配角色对话框时，将用户id赋值给该变量
      this.currUserId = user.id
    },
    //发送更改用户角色的请求
    async setRole(){
      const res = await this.$http.put(`users/${this.currUserId}/role`,
      {rid:this.currUserRoleId})
      this.dialogFormVisibleRole = false
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
  overflow: auto;
}
.input-with-select {
  width: 350px;
  margin-top: 20px;
}
/* .el-option{
  margin-top: 20px;
} */
</style>

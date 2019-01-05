<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="3">
          <img src="@/assets/logo.png" alt>
        </el-col>
        <el-col :span="19" class="content">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a class="contenttwo" href @click.prevent="handleout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu default-active="2" unique-opened router>
          <el-submenu :index="''+item1.order" v-for="(item1,i) in list" :key="i">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2,i) in item1.children" :key="i">
              <i class="el-icon-location"></i>{{item2.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      list:[]
    }
  },
  //若没有登录，直接用/home的方式访问时，则提示需要登录
  //在渲染home组件之前
  beforeCreate() {
    if (localStorage.getItem("token") == null) {
      // console.log(111);
      //编程式导航，将标识改为/login
      this.$router.push({
        path: "/login"
      });
      //提示
      this.$message.warning("请先登录");
    }
  },
  created(){
    this.showListRoles()
  },
  methods: {
    //完成用户退出功能
    handleout() {
      //清除localstoragrtoken
      localStorage.clear();
      //更改标识回到登录组件
      this.$router.push({
        path: "/login"
      });
      //提示
      this.$message.success("退出成功");
    },
    //完成左侧用户功能列表权限的展示功能
    async showListRoles(){
      const res = await this.$http.get('menus')
      console.log(res)
      this.list = res.data.data
    }
  }
};
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
  padding: 0;
}
.aside {
  background-color: blue;
  height: 100%;
}
.main {
  overflow: hidden;
}
.content {
  text-align: center;
  color: white;
  height: 60px;
}
.header h2 {
  line-height: 60px;
}
.contenttwo {
  height: 60px;
  text-align: center;
  text-decoration: none;
  line-height: 60px;
}
</style>

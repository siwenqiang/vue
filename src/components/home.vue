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
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-location"></i>用户列表
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-location"></i>角色列表
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-location"></i>权限列表
            </el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-location"></i>商品列表
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-location"></i>分类参数
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-location"></i>商品分类
            </el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-location"></i>订单列表
            </el-menu-item>
          </el-submenu>

          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-location"></i>数据报表
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

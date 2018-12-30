<template>
  <div class="box">
    <el-form label-position="top" label-width="80px" :model="formdata" class="form">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button type="primary" class="btn" @click.prevent="handleLogin()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    async handleLogin() {
      const res = await this.$http.post("login", this.formdata);
      const {
        data: {
          data,
          meta: { msg, status }
        }
      } = res;
      if (status === 200) {
        //对象解构赋值中有两个data，这里的data怎么区分是第一个data还是第二个data呢
        localStorage.setItem("token", data.token);
        this.$router.push({
          path: "/home"
        });
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  width: 400px;
  background-color: white;
  border-radius: 5px;
  padding: 20px;
}
.btn {
  width: 100%;
}
</style>

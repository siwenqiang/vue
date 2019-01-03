<template>
<el-card class="card">
<!--第二步在使用位置给数据赋值, -->
  <my-bread level1='权限管理' level2='权限列表'></my-bread>
<!-- 表格 -->
    <!-- height 固定高-> 滚动条 -->
    <!-- 表格中的:data绑定的数据，是一个对象数组，表格中的prop对应数组中每一个对象的key名 -->
    <el-table class="table" :data="rights" border>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-if="scope.row.level==='1'">二级</span>
          <span v-if="scope.row.level==='2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
</el-card>
</template>

<script>
export default {
  data(){
    return{
      rights:[]
    }
  },
created(){
  this.getData()
},
methods:{
async getData(){
    // const AUTH_TOKEN = localStorage.getItem("token");
    // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

    const res = await this.$http.get(`rights/list`)
    // console.log(res)
    const {data:{meta:{msg,status},data}}=res
    this.rights = data
  }
}
}
</script>

<style>
.card{
  height: 100%;
  overflow: auto;
}
</style>

<template>
  <el-card>
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert class="alert" title="注意:只允许为第三级分类设置参数" type="warning"></el-alert>
    <!-- 级联选择器 -->
    <el-form :model="form">
      <el-form-item label="请选择商品分类">
        <el-cascader
          :show-all-levels="false"
          expand-trigger="hover"
          :options="options"
          clearable
          :props="defaultProp"
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
data(){
  return{
    form:{},
    selectedOptions:[],
    defaultProp:{
      label:"cat_name",
      value:"cat_id",
      children:"children"
    },
    options:[]
  }
},
created(){
  this.getGoodsCate();
},
methods:{
  handleChange(){
    
  },
  async getGoodsCate() {
    const res = await this.$http.get(`categories?type=3`);
    this.options = res.data.data;
    console.log(this.options);
  }
}
}
</script>

<style>
.alert{
  margin-top: 20px;
}
</style>

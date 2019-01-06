<template>
  <el-card class="card">
    <my-bread level1="商品管理" level2="商品列表">
    </my-bread>
  <!-- 消息提示框 -->
    <el-row class="alert">
      <el-col>
        <el-alert :closable="false" title="添加商品信息" type="info" center show-icon></el-alert>
      </el-col>
    </el-row>
    <!-- 步骤条 -->
    <!-- 通过active的值控制当前是第几个step -->
    <el-steps :active="1*active" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 标签页el-tabs
    当选中某个tab时  v-model绑定的数据active其值就是被选中的name值
    -->
    <el-form :model="form" label-width="80px" label-position="top" class="form">
      <el-tabs @tab-click="changeTab()" tab-position="left" v-model="active">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
          <!-- 级联选择器 -->
          <!-- 级联选择器(表单元素)
            options 数据源
            selectedOptions是[被选中的label的value值]
            props 配置选项 ={label/value/children} 赋值来源都是options数据源中的key名
            clearable 清除
            @change 改变label
            -->
            {{selectedOptions}}
            <el-cascader
              expand-trigger="hover"
              :options="options"
              clearable
              :props="defaultProp"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
        <!-- 复选框组 -->
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDy" :key="i">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <!-- 第三级商品的静态数据 -->
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
          </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
              <el-upload
                action="http://localhost:8888/api/private/v1/upload"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :headers="headers"
                list-type="picture"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="primary" @click="addGoods()">添加商品</el-button>

            <!-- 富文本 -->
            <quill-editor v-model="form.goods_introduce" class="quill"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
// 引入富文本插件所需样式和包
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
   components: {
    // abcDef  -> abc-def
    quillEditor
  },
  data() {
    return {
      active: "1",
      form:{
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",

        // 商品分类 -> 级联选择器的商品分类
        goods_cat: "",
        // 图片  -> 图片上传 -> 图片临时路径
        pics: [],
        // 商品参数  ->  动态参数数据+静态参数数据
        // attr:[{attr_id:?,attr_value:?}]
        attrs: []
      },
      options:[],
      selectedOptions:[],
      defaultProp:{
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      //第三级动态参数的数据
      arrDy:[],
      arrStatic:[],
      headers:{
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created(){
    this.getGoodscate()
  },
  methods:{
    //获取三级数据列表
    async getGoodscate(){
      const res = await this.$http.get('categories?type=3')
      this.options = res.data.data
      // console.log(res)
    },
    //级联选择器的方法
    handleChange(){

    },
    //点击tab切换时触发的事件
    //获取三级数据动态参数数据
    async changeTab(){
      //如果点击的是第二个tab
      if(this.active==='2'){
        if(this.selectedOptions.length===3){
          const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
          console.log(res)
          this.arrDy = res.data.data 

          this.arrDy.forEach(item=>{
           item.attr_vals =
              item.attr_vals.length === 0
                ? []
                : item.attr_vals.trim().split(","); 
          })
        }else{
          this.$message.warning('请先选择三级分类')
        }
      }
      //如果点击的是第三个tab
      if(this.active==='3'){
        if(this.selectedOptions.length===3){
          const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
          console.log(res)
          this.arrStatic = res.data.data 

        }else{
          this.$message.warning('请先选择三级分类')
        }
      }
    },
    handleRemove(file){
      console.log(file)
      //findIndex方法！
      //给form中的pics赋值
      const index = this.form.pics.findIndex(item=>{
        return item.pic=== file.response.data.tem_path
      })

      this.form.pics.splice(index,1)
      

    },
    handleSuccess(response,file){
      console.log(response)
      this.form.pics.push({
        pic:response.data.tem_path
      })
    },
    //完成添加商品的功能
    async addGoods(){
      
      //完成对goods_cat的赋值
      this.form.goods_cat = this.selectedOptions.join(',')
      //为attrs数组赋值
      const arr1 = this.arrDy
      const arr1New=arr1.map(item=>{
        return {attr_id:item.attr_id,attr_value:item.attr_vals}
      })
      // console.log(arr1)
      const arr2 = this.arrStatic
      const arr2New=arr2.map(item=>{
        return {attr_id:item.attr_id,attr_value:item.attr_vals}
      })
      // console.log(arr2)

      const arr = [...arr1New,...arr2New]

      this.form.attrs = arr

      const res = await this.$http.post('goods',this.form)

      this.$router.push({
        path:'/goods'
      })

      console.log(res)
    }
  }
}
</script>

<style>
  .card{
    height: 100%;
    overflow: auto;
  }
  .alert{
    margin-top: 20px;
  }
  .ql-editor {
  /* height: 200px; */

  min-height: 200px;
}
</style>

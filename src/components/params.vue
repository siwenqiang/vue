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
  <div>{{selectedOptions}}</div>
    <!-- tab栏切换 -->
  <el-tabs v-model="active" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="1">
      <el-button type="primary" :disabled="selectedOptions.length===0">设置动态参数</el-button>
      <!-- 表格渲染数据 -->
      <el-table
        height="450px"
        border
        stripe
        :data="arrDy"
        style="width: 100%">

        <!-- 序号 -->
        <el-table-column type="expand" width="80">
          <template slot-scope="scope">
            <!-- 动态tag编辑 -->
            <el-tag
              :key="i"
              v-for="(item,i) in scope.row.attr_vals"
              closable
              :disable-transitions="false"
              @close="handleClose(scope.row,item)">
              {{item}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

          </template>
        </el-table-column>

        <el-table-column
          prop="attr_name"
          label="商品名称"
          width="300"
          >
        </el-table-column>

        <el-table-column
          label="操作" width="200">
          <template slot-scope="scope">
          <el-button  plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button  plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="配置管理" name="2">
      <el-button type="primary" :disabled="selectedOptions.length===0">设置静态参数</el-button>

        <el-table height="300px" :data="arrStatic" style="width: 100%">
          <el-table-column type="index" width="200" label="#"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="200"></el-table-column>

          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" plain circle></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" plain circle></el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-tab-pane>
  </el-tabs>
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
    options:[],
    active:"1",
    arrDy:[],
    arrStatic:[],
    inputVisible: false,
    inputValue: ''
  }
},
created(){
  this.getGoodsCate();
},
methods:{
  handleChange(){
    if (this.selectedOptions.length === 3 && this.active === "1") {
      this.getarrDyData();
    }
    if (this.selectedOptions.length === 3 && this.active === "2") {
       this.getStaticparams();
    }
  },
  async getGoodsCate() {
    const res = await this.$http.get(`categories?type=3`);
    this.options = res.data.data;
    // console.log(this.options);
  },
  async handleClick(){
    if (this.selectedOptions.length === 3 && this.active === "1") {
      this.getarrDyData();
     }
    if (this.selectedOptions.length === 3 && this.active === "2") {
      this.getStaticparams();
    }
  },
  //获取动态参数数据
  async getarrDyData(){
      //发送请求请求动态参数数据
     const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=many`
      );
      console.log(res)
      this.arrDy = res.data.data 
      this.arrDy.forEach(item=>{
       item.attr_vals =
          item.attr_vals.length === 0
            ? []
            : item.attr_vals.trim().split(","); 
      })
  },
  //获取静态参数数据
  async getStaticparams(){
    const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=only`
      );

      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.arrStatic = res.data.data;
        console.log(this.arrStatic);
      } else {
        this.$message.warning(msg);
    }
  },
  async handleClose(attr,item) {
    attr.attr_vals.splice(attr.attr_vals.indexOf(item), 1);
    //删除属性
    const putData = {
      attr_name: attr.attr_name,
      attr_sel: attr.attr_sel,
      attr_vals: attr.attr_vals.join(",") // 接口没写参数的值类型
    };
      // 发送请求 put
    const res = await this.$http.put(
      `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
       putData
    );
    console.log(res)
  },

  showInput(attr) {
    this.inputVisible = true;
    this.$nextTick(_ => {
    this.$refs.saveTagInput.$refs.input.focus();
    });
  },

  async handleInputConfirm(attr) {
    let inputValue = this.inputValue;
    if (inputValue) {
      attr.attr_vals.push(inputValue);
    //添加属性
      const putData = {
        attr_name: attr.attr_name,
        attr_sel: attr.attr_sel,
        attr_vals: attr.attr_vals.join(",") // 接口没写参数的值类型
      };
      // 发送请求 put
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
        putData
      );
    }
    this.inputVisible = false;
    this.inputValue = '';
  }
}
}
</script>

<style>
.alert{
  margin-top: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1='权限管理' level2='角色列表'></my-bread>
    <!-- 按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" class="btn" width="80">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="roles" style="width: 100%">
      <el-table-column type="expand" width="80">
        <template slot-scope="scope">

          <el-row v-for="(item1,i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag type="success" 
              closable
              @close="deleteRights(scope.row,item1.id)"
              >
              {{item1.authName}}
              </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag type="warning" closable
                  @close="deleteRights(scope.row,item2.id)"
                  >{{item2.authName}}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                  </el-col>
                <el-col :span="20">
                  <span v-for="(item3,i) in item2.children" :key="i">
                    <el-tag type="info" closable
                    @close="deleteRights(scope.row,item3.id)"
                    >{{item3.authName}}
                    </el-tag>
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row v-if="scope.row.children.length==0">
            <el-col>
              <span>该用户未设置权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      
      <el-table-column label="操作">
        <template slot-scope="list">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
            @click="showRights(list.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="修改权限"
      :visible.sync="dialogVisiblerights"
      width="30%">
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkArr"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblerights = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
data(){
  return{
    roles:[],
    dialogVisiblerights:false,
    treeData:[],
    checkArr:[],
    roleId:'',
    defaultProps:{
      label:'authName',
      children:'children'
    }
  }
},
created(){
  this.getRolesData()
},
methods:{
  async getRolesData(){
    const res = await this.$http.get('roles')
    
    this.roles = res.data.data
    //res.data.data是当前角色列表0
    // console.log(res.data.data)
  },
  async deleteRights(roles,rightsId){
    //roles是当前用户的权限
    //这里需要的权限ID需要传进来，而不用能roles去里面找权限ID，因为权限的级别不同
    const res = await this.$http.delete(`roles/${roles.id}/rights/${rightsId}`)
    // this.getRolesData()
    // console.log(roles)
    // console.log(res)
    roles.children = res.data.data
  },
  // 显示对话框
  async showRights(rights){
  //获取所有树状结构的权限列表
    const res = await this.$http.get(`rights/tree`)
    // console.log(res)
    this.treeData = res.data.data
    this.dialogVisiblerights = true;
    //rights传进来的就是roles[]
    const tempArr = []
    rights.children.forEach(item1=>{
      // tempArr.push(item1.id)
      item1.children.forEach(item2=>{
        // tempArr.push(item2.id)
        item2.children.forEach(item3=>{
          tempArr.push(item3.id)
        })
      })
    })
    // for(var i = 0;i<rights.children.length;i++){
    //   for(var j = 0;j<rights.children[i].children.length;j++){
    //     for(var a =0;a<rights.children[i].children[j].children.length;a++){
    //       tempArr.push(rights.children[i].children[j].children[a].id)
    //     }
    //   }
    // }
    this.checkArr = tempArr
    // console.log(tempArr)
    // console.log(rights)
    //此处给角色ID赋值方便setRights方法中使用
    this.roleId = rights.id
  },
  //设置角色的权限
  async setRights(){
    const arr1=this.$refs.tree.getCheckedKeys()
    const arr2=this.$refs.tree.getHalfCheckedKeys()
    const arr = [...arr1,...arr2]


    const res = await this.$http.post(`roles/${this.roleId}/rights`,{rids:arr.join(',')})

    this.dialogVisiblerights = false;

    this.getRolesData()
    // console.log(res)
  }
}
}
</script>

<style>
.card{
  height: 100%;
  overflow: auto
}
.btn{
  margin-top: 20px;
}
span{
  margin: 5px 0px;
}
</style>

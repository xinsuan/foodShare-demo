<template>
  <div class="menu-detail">
    <detail-header :info="menuInfo"></detail-header>
    <detail-content :info="menuInfo"></detail-content>
    <comment :info="menuInfo"></comment>
  </div>
</template>
<script>
import DetailHeader from './detail-header'
import DetailContent from './detail-content'
import Comment from './comment'
import {menuInfo} from '@/service/api';
export default {
  components: {DetailHeader, DetailContent, Comment},
  data(){
    return {
      menuInfo:{
        userInfo: {},
        // 但凡是要用到的数据，尽量给空值，不然请求不到数据会报错，特别是多层的数据嵌套
        raw_material: {
          main_material:[],
          accessories_material:[]
        },
        steps:[],
      }
    }
  },
  watch:{
    $route: {
      handler(){
        let {menuId} = this.$route.query;
        if(menuId) {
          menuInfo({menuId}).then(({data}) => {
            this.menuInfo = data.info;
          })
        }else {
          this.$message({
            showClose: true,
            message: '请重新进入',
            type: 'warning'
          });
        }
      },
      immediate: true
    }
  }
}
</script>

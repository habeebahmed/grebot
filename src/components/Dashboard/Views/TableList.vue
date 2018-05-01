<template>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <paper-table :title="table1.title" :sub-title="table1.subTitle" :data="table1.data" :columns="table1.columns" v-if="tableVisible">

          </paper-table>
        </div>
      </div>

      <!-- <div class="col-md-12">
        <div class="card card-plain">
          <paper-table type="hover" :title="table1.title" :sub-title="table1.subTitle" :data="table1.data" :columns="table1.columns">

          </paper-table>
        </div>
      </div> -->

    </div>
</template>
<script>
  import axios from 'axios'
  import PaperTable from 'components/UIComponents/PaperTable.vue'
  const tableColumns = ['Name', 'Gender', 'Total_Questions', 'Total_Correct', 'Total_Wrong', 'dt']
  let tableData = []

  export default {
    components: {
      PaperTable
    },
    created () {
      this.getInfo()
    },
    data () {
      return {
        tableVisible: false,
        table1: {
          title: 'Stripped Table',
          subTitle: 'Here is a subtitle for this table',
          columns: [...tableColumns],
          data: [...tableData]
        }
      }
    },
    methods: {
      getInfo () {
        var url = 'http://localhost:8000/users'
        const view = this
        axios.get(url)
             .then((res) => {
               view.table1.data = res.data.users_info
               console.log(view.tableData)
               view.tableVisible = true
             })
      }
    }
  }

</script>
<style>

</style>

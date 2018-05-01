<template>
<div>

  <!--Stats cards-->
  <div class="row">
    <div class="col-lg-3 col-sm-6" v-for="stats in statsCards">
      <stats-card>
        <div class="icon-big text-center" :class="`icon-${stats.type}`" slot="header">
          <i :class="stats.icon"></i>
        </div>
        <div class="numbers" slot="content">
          <p>{{stats.title}}</p>
          {{stats.value}}
        </div>
        <!-- <div class="stats" slot="footer">
          <i :class="stats.footerIcon"></i> {{stats.footerText}}
        </div> -->
      </stats-card>
    </div>
  </div>

  <!--Charts-->
  <div class="row">

    <div class="col-xs-12">
      <chart-card :chart-data="usersChart.data" :chart-options="usersChart.options">
        <h4 class="title" slot="title">Users behavior</h4>
        <span slot="subTitle"> 24 Hours performance</span>
        <span slot="footer">
            <i class="ti-reload"></i> Updated 3 minutes ago</span>
        <div slot="legend">
          <i class="fa fa-circle text-info"></i> Open
          <i class="fa fa-circle text-danger"></i> Click
          <i class="fa fa-circle text-warning"></i> Click Second Time
        </div>
      </chart-card>
    </div>

    <div class="col-md-6 col-xs-12">
      <chart-card :chart-data="preferencesChart.data" chart-type="Pie">
        <h4 class="title" slot="title">Email Statistics</h4>
        <span slot="subTitle"> Last campaign performance</span>
        <span slot="footer">
            <i class="ti-timer"></i> Campaign set 2 days ago</span>
        <div slot="legend">
          <i class="fa fa-circle text-info"></i> Open
          <i class="fa fa-circle text-danger"></i> Bounce
          <i class="fa fa-circle text-warning"></i> Unsubscribe
        </div>
      </chart-card>
    </div>

    <div class="col-md-6 col-xs-12">
      <chart-card :chart-data="activityChart.data" :chart-options="activityChart.options">
        <h4 class="title" slot="title">2015 Sales</h4>
        <span slot="subTitle"> All products including Taxes</span>
        <span slot="footer">
            <i class="ti-check"></i> Data information certified</span>
        <div slot="legend">
          <i class="fa fa-circle text-info"></i> Tesla Model S
          <i class="fa fa-circle text-warning"></i> BMW 5 Series
        </div>
      </chart-card>
    </div>

  </div>

</div>
</template>
<script>
import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
import axios from 'axios'
export default {
  components: {
    StatsCard,
    ChartCard
  },
  mounted () {
    this.fetchValuesHere()
  },
  /**
   * Chart data used to render stats, charts. Should be replaced with server data
   */
  data () {
    return {
      statsCards: [{
        type: 'info', // warning,success,danger,info
        icon: 'ti-user',
        title: 'Total Users',
        value: 'Fetching',
        footerText: 'Updated now',
        footerIcon: 'ti-reload'
      },
      {
        type: 'warning',
        icon: 'ti-book',
        title: 'Total Words',
        value: 'Fetching',
        footerText: 'Last day',
        footerIcon: 'ti-calendar'
      },
      {
        type: 'danger',
        icon: 'ti-na',
        title: 'Hard Words ',
        value: 'Fetching',
        footerText: 'In the last hour',
        footerIcon: 'ti-timer'
      },
      {
        type: 'info',
        icon: 'ti-check',
        title: 'Easy Words',
        value: 'Fetching',
        footerText: 'In the last hour',
        footerIcon: 'ti-timer'
      },
      {
        type: 'warning', // warning,success,danger,info
        icon: 'ti-plus',
        title: 'Males',
        value: 'Fetching',
        footerText: 'Updated now',
        footerIcon: 'ti-reload'
      },
      {
        type: 'success', // warning,success,danger,info
        icon: 'ti-minus',
        title: 'Females',
        value: 'Fetching',
        footerText: 'Updated now',
        footerIcon: 'ti-reload'
      }
      ],
      usersChart: {
        data: {
          labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
          series: [
            [287, 385, 490, 562, 594, 626, 698, 895, 952],
            [67, 152, 193, 240, 387, 435, 535, 642, 744],
            [23, 113, 67, 108, 190, 239, 307, 410, 410]
          ]
        },
        options: {
          low: 0,
          high: 1000,
          showArea: true,
          height: '245px',
          axisX: {
            showGrid: false
          },
          lineSmooth: this.$Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false
        }
      },
      activityChart: {
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          series: [
            [542, 543, 520, 680, 653, 753, 326, 434, 568, 610, 756, 895],
            [230, 293, 380, 480, 503, 553, 600, 664, 698, 710, 736, 795]
          ]
        },
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false
          },
          height: '245px'
        }
      },
      preferencesChart: {
        data: {
          labels: ['62%', '32%', '6%'],
          series: [62, 32, 6]
        },
        options: {}
      }

    }
  },
  methods: {
    fetchValuesHere () {
      // this.statsCards[0].value = '6'
      var url = 'http://localhost:8000/usersinfo'
      axios.get(url)
           .then((res) => {
             this.statsCards[0].value = res.data.total
             this.statsCards[4].value = res.data.males
             this.statsCards[5].value = res.data.females
           })
      url = 'http://localhost:8000/words'
      axios.get(url)
           .then((res) => {
             this.statsCards[1].value = res.data.length
             this.statsCards[2].value = res.data.difficult
             this.statsCards[3].value = res.data.easy
           })
    }
  }
}
</script>
<style>

</style>

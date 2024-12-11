import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default class BarChartComponent extends Component {
  chart = null;

  @action
  renderChart(element) {
    const { labels, data, label } = this.args;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(element, {
      type: 'bar',
      data: {
        labels: labels, // 横坐标的标签
        datasets: [
          {
            label: label, // 数据集标签
            data: data, // 条形图的数据
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // 条形颜色
            borderColor: 'rgba(75, 192, 192, 1)', // 边框颜色
            borderWidth: 1, // 边框宽度
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true, // Y轴从0开始
          },
        },
      },
    });
  }
}

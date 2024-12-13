import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default class BarChartComponent extends Component {
  chart = null;

  @action
  renderChart(element) {
    const { labels, data, label, type } = this.args;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(element, {
      type: type || 'bar', // 如果没有传入type参数，则默认为 bar 类型
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false, // 对折线图有效，表示不填充面积
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            categoryPercentage: 0.5,
            barPercentage: 0.5,
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 2,
            },
          },
        },
      },
    });
  }
}


import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class WeeklyMonthlyStatsController extends Controller {
  @service firebase; // 注入 Firebase 服务
  @service router; // 注入路由服务

  @tracked weeklyStats = []; // 存储周数据
  @tracked monthlyStats = []; // 存储月数据
  @tracked isLoading = true; // 加载状态
  @tracked error = null; // 错误信息

  // 生成图表需要的 labels 和 data
  get weeklyLabels() {
    return this.weeklyStats.map((plan) => plan.day || 'Day');
  }

  get weeklyData() {
    return this.weeklyStats.map((plan) => plan.distance || 0);
  }

  get monthlyLabels() {
    return this.monthlyStats.map((plan, index) => `Week ${index + 1}`);
  }

  get monthlyData() {
    return this.monthlyStats.map((plan) => plan.distance || 0);
  }

  constructor() {
    super(...arguments);
    this.loadStats(); // 初始化时加载数据
  }

  async loadStats() {
    this.isLoading = true; // 开始加载
    this.error = null; // 重置错误状态
    try {
      const allPlans = await this.firebase.fetchAllPlans(); // 从 Firebase 提取所有计划

      // 过滤出周视图和月视图数据
      this.weeklyStats = this.filterWeeklyPlans(allPlans);
      this.monthlyStats = this.filterMonthlyPlans(allPlans);
    } catch (error) {
      console.error('Error loading stats:', error);
      this.error = 'Failed to load stats. Please try again later.';
    } finally {
      this.isLoading = false; // 加载完成
    }
  }

  // 过滤出本周的数据
  filterWeeklyPlans(allPlans) {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // 设置为周一

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // 设置为周日

    return allPlans
      .filter((plan) => {
        const planDate = new Date(plan.startTime);
        return planDate >= startOfWeek && planDate <= endOfWeek;
      })
      .map((plan) => ({
        day: plan.startTime ? this.getDayName(new Date(plan.startTime)) : 'N/A',
        distance: plan.distance || 0,
      }));
  }

  // 过滤出本月的数据
  filterMonthlyPlans(allPlans) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // 月初
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // 月末

    return allPlans
      .filter((plan) => {
        const planDate = new Date(plan.startTime);
        return planDate >= startOfMonth && planDate <= endOfMonth;
      })
      .reduce((weeks, plan) => {
        // 根据日期分组到对应周
        const weekIndex = Math.floor(
          (new Date(plan.startTime).getDate() - 1) / 7
        );
        if (!weeks[weekIndex]) {
          weeks[weekIndex] = { distance: 0 };
        }
        weeks[weekIndex].distance += plan.distance || 0;
        return weeks;
      }, []);
  }

  // 返回星期名称
  getDayName(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  @action
  goBack() {
    // 返回到上一页或指定路由
    this.router.transitionTo('calendar');
  }

  @action
  async logout() {
    await this.firebase.logout();
    this.router.transitionTo('index');
  }
}


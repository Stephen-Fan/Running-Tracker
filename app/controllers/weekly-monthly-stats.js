import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { onAuthStateChanged } from 'firebase/auth';

export default class WeeklyMonthlyStatsController extends Controller {
  @service firebase; // 注入 Firebase 服务
  @service router;   // 注入路由服务

  @tracked allPlans = [];
  @tracked weeklyStats = [];    // 存储周数据
  @tracked monthlyStats = [];   // 存储月数据
  @tracked isLoading = true;    // 加载状态
  @tracked error = null;        // 错误信息

  @tracked selectedView = null;       // 表示当前选择的视图(weekly或monthly)
  @tracked selectedChartType = null;  // 表示当前选择的图表类型(time、distance或pace)

  constructor() {
    super(...arguments);
    console.log("11111111");
    // this.loadStats(); // 初始化时加载数据
    this.setupAuthListener();
  }

  setupAuthListener() {
    this.firebase.authReady.then(() => {
      const auth = this.firebase.auth;
  
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // console.log('User logged in:', user);
          this.loadStats();
        } else {
          console.log('User logged out.');
          this.weeklyStats = [];
          this.monthlyStats = [];
          this.error = 'You must be logged in to view stats.';
        }
      });
    });
  }

  //week
  get weeklyLabels() {
    return this.weeklyStats.map((plan) => plan.day || 'Day');
  }

  get weeklyData() {
    return this.weeklyStats.map((plan) => plan.distance || 0);
  }

  get weeklyTimeLabels() {
    return this.weeklyStats.map(plan => plan.day);
  }

  get weeklyTimeData() {
    return this.weeklyStats.map(plan => plan.duration || 0);
  }

  // 周配速数据
  get weeklyPaceLabels() {
    return this.weeklyStats.map(plan => plan.day);
  }
  get weeklyPaceData() {
    return this.weeklyStats.map(plan => plan.pace || 0);
  }

  //month
  get monthlyLabels() {
    return this.monthlyStats.map(plan => `Day ${plan.day}`);
  }

  get monthlyData() {
    return this.monthlyStats.map((plan) => plan.distance || 0);
  }

  get monthlyTimeLabels() {
    return this.monthlyStats.map(plan => `Day ${plan.day}`);
  }

  get monthlyTimeData() {
    return this.monthlyStats.map(plan => plan.duration || 0);
  }

  // 月配速数据
  get monthlyPaceLabels() {
    return this.monthlyStats.map(plan => `Day ${plan.day}`);
  }
  get monthlyPaceData() {
    return this.monthlyStats.map(plan => plan.pace || 0);
  }

  async loadStats() {
    this.isLoading = true; // 开始加载
    this.error = null; // 重置错误状态
    try {
      const allPlans = await this.firebase.fetchAllPlansComplete();

      if (!allPlans || allPlans.length === 0) {
        console.log('No plans found.');
        this.weeklyStats = [];
        this.monthlyStats = [];
      } else {
        console.log('All plans fetched:', allPlans);

        // Process weekly and monthly stats
        this.weeklyStats = this.filterWeeklyPlans(allPlans);
        this.monthlyStats = this.filterMonthlyPlans(allPlans);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      this.error = 'Failed to load stats. Please try again later.';
    } finally {
      this.isLoading = false; // 加载完成
    }
  }

  filterWeeklyPlans(allPlans) {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0是周日, 1是周一
    const mondayOffset = (dayOfWeek + 6) % 7; 
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - mondayOffset);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let weeklyData = weekDays.map(day => ({ day, distance: 0, duration: 0, pace: 0 }));

    allPlans.forEach(plan => {
      const planDate = new Date(plan.startTime);
      if (planDate >= startOfWeek && planDate <= endOfWeek) {
        const dayName = this.getDayName(planDate);
        const dayEntry = weeklyData.find(d => d.day === dayName);
        if (dayEntry) {
          // 将distance和duration转换为数值
          const distanceVal = parseFloat(plan.distance) || 0;
          const durationVal = parseFloat(plan.duration) || 0;

          dayEntry.distance += distanceVal;
          dayEntry.duration = durationVal; 
          console.log("时间：", dayEntry.duration);
        }
      }
    });

    // 计算pace
    weeklyData.forEach(dayEntry => {
      if (dayEntry.distance > 0) {
        dayEntry.pace = dayEntry.duration / dayEntry.distance; // pace = 分钟 / 英里
      } else {
        dayEntry.pace = 0;
      }
      console.log("配速weekly: ", dayEntry.pace);
    });

    return weeklyData;
  }

  filterMonthlyPlans(allPlans) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
    // 当月总天数
    const totalDays = endOfMonth.getDate();
  
    // 初始化一个按天分组的数组，每天一个对象
    let monthlyData = [];
    for (let i = 1; i <= totalDays; i++) {
      monthlyData.push({ day: i, distance: 0, duration: 0, pace: 0 });
    }
  
    allPlans
      .filter((plan) => {
        const planDate = new Date(plan.startTime);
        return planDate >= startOfMonth && planDate <= endOfMonth;
      })
      .forEach((plan) => {
        const planDate = new Date(plan.startTime);
        const dayOfMonth = planDate.getDate(); 
        const dayEntry = monthlyData[dayOfMonth - 1]; // dayOfMonth从1开始，数组索引从0开始
        if (dayEntry) {
          const distanceVal = parseFloat(plan.distance) || 0;
          const durationVal = parseFloat(plan.duration) || 0;

          dayEntry.distance += distanceVal;
          dayEntry.duration += durationVal;
        }
      });

    // 计算pace
    monthlyData.forEach(dayEntry => {
      if (dayEntry.distance > 0) {
        dayEntry.pace = dayEntry.duration / dayEntry.distance;
      } else {
        dayEntry.pace = 0;
      }
    });
  
    return monthlyData;
  }

  getDayName(date) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayIndex = date.getDay(); // 0(周日)到6(周六)
    return days[(dayIndex + 6) % 7]; 
  }

  @action
  selectView(view) {
    // 用户点击按钮时更新selectedView
    this.selectedView = view;
    // 重置选中图表类型
    this.selectedChartType = null;
  }

  @action
  selectChartType(type) {
    // 用户选择图表类型(time、distance、pace)
    this.selectedChartType = type;
  }

  @action
  goBack() {
    this.router.transitionTo('calendar');
  }

  @action
  async logout() {
    await this.firebase.logout();
    this.router.transitionTo('index');
  }
}




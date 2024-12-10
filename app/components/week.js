import Component from '@glimmer/component';
import { action } from '@ember/object';
import Calendar from '@toast-ui/calendar';
import { inject as service } from '@ember/service';
import { getDoc } from 'firebase/firestore';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

export default class WeekComponent extends Component {

  @service firebase;
  @action
  async initializeCalendar(element) {
    function formatTime(time) {
      const hours = `${time.getHours()}`.padStart(2, '0');
      const minutes = `${time.getMinutes()}`.padStart(2, '0');

      return `${hours}:${minutes}`;
    }

    const calendar = new Calendar(element, {
      defaultView: 'month',
      template: {
        time(event) {
          const { start, end, title } = event;

          return `<span style="color: white;">${formatTime(start)}~${formatTime(end)} ${title}</span>`;
        },
        allday(event) {
          return `<span style="color: gray;">${event.title}</span>`;
        },
      },
      calendars: [
        {
          id: 'Walk',
          name: 'Walk',
          backgroundColor: "rgb(0, 169, 255)",
        },
        {
          id: 'Jogging',
          name: 'Jogging',
          backgroundColor: "rgb(255, 187, 59)",
        },
        {
          id: 'Running',
          name: 'Running',
          backgroundColor: "rgb(255, 86, 131)",
        },
        {
          id: 'Stroll',
          name: 'Stroll',
          backgroundColor: "rgb(2, 189, 157)",
        },
        {
          id: 'Race walking',
          name: 'Race walking',
          backgroundColor: "rgb(158, 95, 254)",
        },
        {
          id: 'Hiking',
          name: 'Hiking',
          backgroundColor: "rgb(186, 220, 0)",
        },
      ],
    });
    
    let allPlans = await this.firebase.fetchAllPlans();
    console.log(allPlans)
    let eventObjs = allPlans.map((plan) => {
      return { id: plan.id, calendarId: plan.planCat ?? "Walk", title: plan.planName, location: plan.location?.name, start: plan.startTime, end: plan.startTime + plan.duration * 60000, isReadOnly: true,  state: null, attendees: null, 
        category: 'task',
        body: "Duration: " + plan.duration + " mins",
        // color: '#00a9ff',
        // backgroundColor: '#00a9ff',
      };
    });

    console.log(eventObjs);

    // distance : "1" 
    // duration : "30" 
    // id : "VaYrGxncDYCydNqWSJw3" 
    // location : null 
    // planName : "Linghe Test"
    // startTime : 1733931960000

    calendar.createEvents(eventObjs);

    // return {
    //   id: params.plan_id,
    //   planName: data.planName || 'Unnamed Plan',
    //   startTime: data.startTime || null, // Handle missing startTime
    //   distance: data.distance || 0,
    //   duration: data.duration || 0,
    //   location: data.location || null,
    // };

    calendar.setOptions({
      useDetailPopup: true,
      timezone: {
        zones: [
          {
            timezoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        ],
      },
    });

  }
}

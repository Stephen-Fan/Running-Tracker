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
          return `<div style="color: black;background: rgb(137, 207, 240);padding-left: 0.5rem;border-radius: 0.2rem;">${title}</div>`;
        },
      },
      calendars: [
        {
          id: 'Absent',
          name: 'Absent',
          backgroundColor: 'rgb(255, 86, 131)',
        },
        {
          id: 'Scheduled',
          name: 'Scheduled',
          backgroundColor: 'rgb(255, 192, 0)',
        },
        {
          id: 'Completed',
          name: 'Completed',
          backgroundColor: 'rgb(76, 187, 23)',
        },
      ],
    });

    let allPlans = await this.firebase.fetchAllPlans();

    let eventObjs = allPlans.map((plan) => {
      const current = Date.now();
      if (((plan.startTime + plan.duration * 60000) < current) && plan.planCat != "Completed"){
        plan.planCat = 'Absent'
      }
      else if ((plan.startTime + plan.duration * 60000) > current && plan.planCat != "Completed"){
        plan.planCat = 'Scheduled'
      }

      if (plan.location == null){
        plan.location = {name: "Undecided"}
      }

      return {
        id: plan.id,
        calendarId: plan.planCat,
        title: plan.planName,
        location: plan.location?.name,
        start: plan.startTime,
        end: plan.startTime + plan.duration * 60000,
        isReadOnly: true,
        state: null,
        attendees: null,
        category: 'time',
        body: 'Duration: ' + plan.duration + ' mins',
      };
    });

    calendar.createEvents(eventObjs);


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


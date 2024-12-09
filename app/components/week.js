import Component from '@glimmer/component';
import { action } from '@ember/object';
import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

export default class WeekComponent extends Component {
  @action
  initializeCalendar(element) {
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
          id: 'cal1',
          name: 'Personal',
          backgroundColor: '#03bd9e',
        },
        {
          id: 'cal2',
          name: 'Work',
          backgroundColor: '#00a9ff',
        },
      ],
    });

    calendar.setOptions({
      useFormPopup: true,
      useDetailPopup: true,
    });

    calendar.on('beforeCreateEvent', (eventObj) => {
      const now = new Date();
      let ms = now.getMilliseconds();
      calendar.createEvents([
        {
          ...eventObj,
          id: ms,
        },
      ]);
    });

    calendar.on('beforeUpdateEvent', ({ event, changes }) => {
      calendar.updateEvent(event.id, event.calendarId, changes);
    });

    calendar.on('beforeDeleteEvent', (eventObj) => {
      calendar.deleteEvent(eventObj.id, eventObj.calendarId);
    });
  }
}

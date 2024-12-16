# Module 2 Group Assignment

CSCI 5117, Fall 2024, [assignment description](https://canvas.umn.edu/courses/460699/pages/project-2)

## App Info:

* Team Name: 20245117

* App Name: Running Tracker
* App Link: <https://project2-f4147.web.app//>

### Students

* Qinghong Fan, fan00123@umn.edu
* Linghe Wang, wang9257@umn.edu
* Zhiyuan Lin, lin00905@umn.edu
* Abdullahi Nor, nor00003@umn.edu


## Key Features

**Describe the most challenging features you implemented
(one sentence per bullet, maximum 4 bullets):**

* We used a calendar API to connect to our database and display user plans.
* We fetched the plan's stats from the database and made charts based on user running stats.
* We embedded Google Maps and Geolocation functionality and created markers (stored locally and remotely) in the map to indicate the plan's location.

Which (if any) device integration(s) does your app support?

* Google Maps and Geolocation are integrated into the app.

Which (if any) progressive web app feature(s) does your app support?

* N/A



## Mockup images

**[Add images/photos that show your mockup](https://stackoverflow.com/questions/10189356/how-to-add-screenshot-to-readmes-in-github-repository) along with a very brief caption:**
### Desktop end
This is the default page when unlogged-in users browse the website.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/pc_home_not_login.png "pc home page")

This is the home page after users log in. A calendar is displayed, where the user can select any date to view past running stats or make a new plan. A notification will pop up to remind the user of the running plan.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/pc_home_login.png "pc home page")

When the user clicks on a colored date, this page will show up to display the user's running stats on that day.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/pc_specific_date_stats.png "specific date stats")

This page displays the user's weekly or monthly running stats.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/pc_weekly_monthly_stats.png "weekly&monthly stats")

The user can make a new running plan on this page if the user selects an uncolored date on the calendar.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/pc_create_new_plan.png "create new plan")

The user can enter the desired destination and save this route for future running.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/pc_map_page.png "PC map page")

The user can view the saved running route.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/pc_saved_route_page.png "PC saved map page")

The user can view, edit, and delete the created plan.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/pc_view_plan.png "PC view plan page")

### Phone end
This is the default page when unlogged-in users browse the website.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/phone_home_not_login.png "phone home page")

This is the home page after users log in. A calendar is displayed, where the user can select any date to view past running stats or make a new plan. A notification will pop up to remind the user of the running plan.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/phone_home_login.png "phone home page")

When the user clicks on a colored date, this page will show up to display the user's running stats on that day.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/phone_specific_date_stats.png "specific date stats")

This page displays the user's weekly or monthly running stats.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/phone_weekly_monthly_stats.png "weekly&monthly stats")

The user can make a new running plan on this page if the user selects an uncolored date on the calendar.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/phone_create_new_plan.png "create new plan")

The user can enter the desired destination and choose either to save this route for future running or start running right away.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/phone_map_page.png "Phone map page")

The user can view the saved running route. The user can also apply this route to start running right away with this route.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/phone_saved_route_page.png "Phone saved map page")

The user can view, edit, and delete the created plan.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/low-fidelity/phone_view_plan.png "Phone view plan page")

![](https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif)


## Testing Notes

**Is there anything special we need to know in order to effectively test your app? (optional):**

* The user stats page only shows the stats for completed plans, while absent plan or scheduled plan stats are not recorded. When testing the user stats page, sometimes, if the stats for completed plans are not shown in the chart, please refresh the page; then, the stats should be displayed there.



## Screenshots of Site (complete)

**[Add a screenshot of each key page](https://stackoverflow.com/questions/10189356/how-to-add-screenshot-to-readmes-in-github-repository)
along with a very brief caption:**

After the user login, auto redirect to this page. The calendar will display all user plans in this month.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/Complete-Features/calendar.png "calendar page")

The user can create new plan on this page.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/Complete-Features/create.png "create new plan page")

The user can edit existing plan on this page.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/Complete-Features/edit.png "edit plan page")

The user can view all plans on this page, including edit and delete any plans.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/Complete-Features/plans.png "all plans page")

The user can use search bar to search for a location and create a marker, and associate the marker with a plan as the plan location.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/Complete-Features/map.png "map page")

The user can view all completed running plans' stats within this week or this month.
![Alt text](https://github.com/csci5117f24/project-2-20245117/blob/main/Complete-Features/stats.png "stats page")

![](https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif)



## External Dependencies

**Document integrations with 3rd Party code or services here.
Please do not document required libraries (e.g., React, Azure serverless functions, Azure nosql).**

* Calendar from Toast UI: We used this calendar to display user plans in current month.

**If there's anything else you would like to disclose about how your project
relied on external code, expertise, or anything else, please disclose that
here:**

* N/A

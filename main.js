
const allRewards = [];
const wakeUpTime = [];
const tasksAndTimes = [];
const selectedRewards = [];


function startScheduler() {
  $('.start-schedule').html(`
    <div class="preamble">
      <p lass="preamble">Welcome the to light weight app that helps you schedule your daily reponsibilities and curates rewards in the form of local activities pulled from from Meetup and Eventbrite. No sign up, just download your schedule when done.</p>
      <button>Schedule Day</button>   
    </div>`); 
    $('.preamble').on('click', 'button', event => {
    setWakeUpTime();
    $('.preamble').remove();
  });
  console.log('startScheduler ran!');
}


function setWakeUpTime() {
  $('.js-wake-time-form').html(`
    <fieldset class="js-schedule-starter">
      <legend class="bold-text">Start Time</legend>
      <div class="row">
        <label for="wakeup-time">What time are you starting work?</label>
        <input id="wakeup-time" type="time" name="appt-time" value="07:00">
      </div> 
      <button type='submit'>Submit</button>     
    </fieldset>`);
  console.log('setWakeUpTime ran!');
}


function handleNewResponsibilitySubmit() {
  //this will handle when a user submits a responsibility 
  console.log('handleNewResponsibilitySubmit was set');
  $('.js-wake-time-form').on('submit', event => {
    event.preventDefault();
    console.log('yup, the event listener is runnin');
    let wakeTime = $('#wakeup-time').val();
    //you need this where there are many button, input, element, etc.
    //let wakeTime = $(event.currentTarget).find('#wakeup-time').val();
    console.log(wakeTime);
    wakeUpTime.push({wake: wakeTime});
    
    $('.js-wake-time-form').remove();
    addTaskAndTime();
    //getUserLocation(); This initiates the whole reward 
    //showing flow of the app so let's leave it for now    

  });
}

function addTaskAndTime() {
   $('.js-schedule-task-form').html(`
    <fieldset class="js-task-starter">
      <legend>Ok, you gotta work starting at ${wakeUpTime[0].wake} like you said. Now, plan at least 2 responsibilities to see the rewards.</legend>
      <div class="row">
        <span class="time-in-input">
        <label for="task-start-time">From</label>
        <input id="task-start-time" type="time" name="a" value="${wakeUpTime[0].wake}" required>
        </span>
        <span class="time-out-input">
        <label for="task-end-time">to</label>
        <input id="task-end-time" type="time" name="b" required><span>I will...</span>
        </span>
      </div>
      <div class="row">    
        <label for="task-activity"></label>
        <textarea id="task-activity" name="textarea" rows="7" placeholder="...action verb + X responsibility driving towards Y outcome. (eg. crush the slide deck for my for presentation at work so myself / my team demonstrate our competence to our collegues.)" required></textarea>
      </div>
      <button type='submit'>Submit</button>
    </fieldset>`);
  
}

function handleTaskSubmit() {
  console.log('handleTaskSubmit is set!')
  $('.js-schedule-task-form').on('submit', event => {
    event.preventDefault();
    let taskStartTime = $('#task-start-time').val();
    let taskEndTime = $('#task-end-time').val();
    let taskActivityName = $('#task-activity').val();
    
    formattedTaskStartTime = formatInputTimes(taskStartTime);
    formattedTaskEndTime = formatInputTimes(taskEndTime);


    tasksAndTimes.push({
      start: formattedTaskStartTime,
      end: formattedTaskEndTime,
      activity: taskActivityName  
    })



    $('#task-start-time').val(taskEndTime);
    $('#task-end-time').val('');
    $('#task-activity').val('');
    

    console.log(tasksAndTimes[0].end)
   /* 
   j++
   let lastEndTime = j === 1 ? '08:00' : tasksAndTimes[j].end;
   if(j != 0) {console.log(j);}
   console.log("buller"); 
   console.log(j);
   */

    console.log(tasksAndTimes);
    displayTasks();
  //generateTaskItemsString(tasksAndTimes);
  });
}

//this function take the 24hours times that you get from 
//runnning .val() on inputs and turns them in to 12 hour times
function formatInputTimes(startOrEndTimes) {
  let taskTimeHrs = parseInt(startOrEndTimes.substring(0,2), 10);
  taskTimeMin = startOrEndTimes.substring(3)
  let taskStartTime12hrs = ((taskTimeHrs + 11) % 12 + 1);
  return `${taskStartTime12hrs}:${taskTimeMin}`

}



function generateTaskItemsString(tasklist) {
  if (tasklist.length === 2 && allRewards.length === 0) {
    startRewardsFlow(); 
  }
  const tasks = tasklist.map((task, index) => 
    generateTaskElement(task, index));
  // join together the strings
  return tasks.join("");
}


function generateTaskElement(task, taskIndex) {
  return `
    <p>${task.start} to ${task.end} I will ${task.activity}<p>`

}


function displayTasks() {
  const tasksString = generateTaskItemsString(tasksAndTimes);
    $('.js-task-display').html(tasksString);
}


function startRewardsFlow() {
$('.rewards').html(`<button class="getrewards">When ready, check the rewards.</button>`);

      $('.rewards').on('click', '.getrewards', event => {
      $('.js-schedule-task-form').toggle();
      $.getJSON('https://ipinfo.io/json', function(data){
       console.log(data)
       //grabbing the lat and lng out of sting that has them together 
       let lat = data.loc.split(',')[0];
       let lng = data.loc.split(',')[1];

       getInfoFromEventbrite(lat, lng);
      
       $('.js-back-to-schedule').html('<a id="task-form-toggler" class="back-to-schedule-link" href="#">toggle task form</a>');
       $('#task-form-toggler').on('click', event => {
           $('.js-schedule-task-form').toggle();
           event.preventDefault();
       });
    }) 

  });
  
  
}

//Eventbrite Token is... 2IECIQR5YEVJCHRLD7

function getInfoFromEventbrite(lat, lng) {
  console.log(`the lat is ${lat} and the lng is ${lng} here`); 
  //getting the current date in ISO format
  let currentDate = new Date();
  //here we are mitigating the "zero UTC offset"in .toISOString() 
  let offsetDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000);
  let currentISODateString = offsetDate.toISOString().substring(0,19);
  console.log(currentISODateString);
  //getting the date two days from the current date in ISO format
  //here are creating future date 1.5 days in the future
  //let dateFromCurrentDate = 
  offsetDate.setDate(offsetDate.getDate() + 1.5)
  dateFromCurrentDateISOString = offsetDate.toISOString().substring(0,19);
  console.log(dateFromCurrentDateISOString);
  
  const query = {
    'location.latitude': lat,
    'location.longitude': lng,
     token: 'YLHCYUV6MWY2WDN2EHYE',
    'location.within': '30mi',
    //'start_date.keyword':'today',
    'start_date.range_start': currentISODateString, 
    'start_date.range_end': dateFromCurrentDateISOString   
  }

  $.getJSON('https://www.eventbriteapi.com/v3/events/search/', query, function(data) {
    console.log('here below is the Eventbrite stuff')
    console.log(data.events);
 
  const eventBriteHtmlWrappedResults = data.events.map((one_event, index) => displayEventbriteResults(one_event, index));

      console.log(eventBriteHtmlWrappedResults);  
      allRewards.push(eventBriteHtmlWrappedResults);
      console.log(allRewards);
      getInfoFromMeetup(lat, lng);
    }); 

}

// Meetup key is... 7f274db441d22481c12916293f201e

function getInfoFromMeetup(lat, lng) {

let url = 'https://api.meetup.com/2/open_events?and_text=False&offset=0&format=json&lon=' + lng +'&limited_events=False&page=200&radius=25.0&lat=' + lat + '&desc=False&status=upcoming&sig_id=189363096&sig=3d3dffd401a47afcedebbf4e854bc7667a05280d';

$.ajax({ 
    method: "get", // GET = requesting data
    dataType: 'jsonp',
    //time: '1520983054377}
    url: url, 
    success: function(data) { 
      console.log('here below is the meetup stuff')
      console.log(data); // Set data that comes back from the server to 'text'
      filterMeetupInfo(data);
    },
  });

}

function filterMeetupInfo(apiResult) {
  console.log(apiResult.results);
  //getting current time and date and the time and date exacty 
  //two days in the future

  let Currenttime = new Date().getTime();
  let diff = 2160;
  let futureDate = new Date(Currenttime + diff*60000).getTime();
  console.log(Currenttime);
  console.log(futureDate);
  //filter the API results so that
  
  const filteredForDateRelevance = apiResult.results.filter(result => result.time < futureDate);
    
  const filteredAndHtmlWrappedResults = filteredForDateRelevance.map((filteredResult, index) => displayMeetupResults(filteredResult, index));

  allRewards.push(filteredAndHtmlWrappedResults);
  console.log('below this is the allRewards filled with meetup')
  console.log(filteredAndHtmlWrappedResults);
  console.log(filteredForDateRelevance);
  console.log(filteredAndHtmlWrappedResults);

  renderRewards();
}

  //the time needs to look like this to start that flow
  //2018-03-23T19:00:00
function displayMeetupResults(filteredApiResult, index) { 
  muRawDateTime = new Date(filteredApiResult.time)
  let muOffsetDate = new Date(muRawDateTime.getTime() - muRawDateTime.getTimezoneOffset() * 60000);
  let muCurrentISODateString = muOffsetDate.toISOString().substring(0,19);
  console.log(muCurrentISODateString);

  //grabbing out hours and minutes
  let eventTimeHrs = parseInt(muCurrentISODateString.substring(11,13), 10);
  let eventTimeMin = parseInt(muCurrentISODateString.substring(14,16), 10);
  let eventTimeDay = parseInt(muCurrentISODateString.substring(8,10), 10);
  //when you run parseInt() on the string '00' turns the double
  //zero into a single 0, this detects and corrects for that
  let eventTimeMinCorrected = eventTimeMin === 0 ? '00' : eventTimeMin  
  console.log(eventTimeMinCorrected);
  //this is the actual part that convert 24hr hours to 12hr hours
  let eventTime12hrs = ((eventTimeHrs + 11) % 12 + 1);
  let amPm = eventTimeHrs >= 12 ? "PM":"AM";

  console.log(eventTime12hrs);
  
  let currentDay = new Date().getDate();
  let todayOrTomorrow = currentDay === eventTimeDay ? 'Today' : 'Tomorrow';

  let complete12HrTime = `${todayOrTomorrow} at ${eventTime12hrs}:${eventTimeMinCorrected} ${amPm}`;

  return `<article class="reward-blocks-mu" data-item-index="${index}"> 
            <dl>
            <dt class="name bold-text">${filteredApiResult.name}</dt>
            <dd class="time bold-text">${complete12HrTime}</dd>
            <dd><a href="${filteredApiResult.event_url}" target="_blank">Go to official page</a></dd>
            <button class="js-reward-schedule rewardsitems">Schedule Reward</button>
            <dl>
          </article>`;
}


function displayEventbriteResults(eventBriteApiResult, index) { 
  //this block of code aims to convert 24 hour time to 12 hour time
  let eventTime24hrs = eventBriteApiResult.start.local;
  console.log(eventTime24hrs);
  //grabbing out hours and minutes
  let eventTimeHrs = parseInt(eventTime24hrs.substring(11,13), 10);
  let eventTimeMin = parseInt(eventTime24hrs.substring(14,16), 10);
  let eventTimeDay = parseInt(eventTime24hrs.substring(8,10), 10);
  //when you run parseInt() on the string '00' turns the double
  //zero into a single 0, this detects and corrects for that
  let eventTimeMinCorrected = eventTimeMin === 0 ? '00' : eventTimeMin  
  console.log(eventTimeMinCorrected);
  //this is the actual part that convert 24hr hours to 12hr hours
  let eventTime12hrs = ((eventTimeHrs + 11) % 12 + 1);
  let amPm = eventTimeHrs >= 12 ? "PM":"AM";

  console.log(eventTime12hrs);
  
  let currentDay = new Date().getDate();
  let todayOrTomorrow = currentDay === eventTimeDay ? 'Today' : 'Tomorrow';

  //this the string with the 12 hour time that get printed out
  let complete12HrTime = `${todayOrTomorrow} at ${eventTime12hrs}:${eventTimeMinCorrected} ${amPm}`;

  console.log(complete12HrTime);


  return `<article class="reward-blocks-eb">
            <dl data-item-index="${index}">
              <dt class="name bold-text">${eventBriteApiResult.name.text}</dt>
              <dd class="time bold-text"><time>${complete12HrTime}</time></dd>
              <dd><a href="${eventBriteApiResult.url}" target="_blank">Go to official page</a></dd>
              <button class="js-reward-schedule rewardsitems">Schedule Reward</button>
            </dl>
          </article>`;
}

function scheduleReward() {
  $('.rewards').on('click', '.js-reward-schedule', event => {
    event.stopPropagation();
    console.log('it is working at least');
    let rewardItemName = $(event.currentTarget).siblings('.name').text();
    let rewardItemStartTime = $(event.currentTarget).siblings('.time').text();
    console.log(rewardItemName);
    console.log(rewardItemStartTime);
    selectedRewards.push({
      rewardName: rewardItemName,
      rewardStart: rewardItemStartTime
    });
    generateSelectedRewardsString();
    //look at the shopping cart again, they did it somehow
    //have to get click the button, find the closest div with a class
    //of name, grab it's text
  })
}

function generateSelectedRewardsString() {
  selectedRewardsString = selectedRewards.map((reward, index) => 
  generateSelectedAwardItem(reward, index));

  $('.chosen-reward-display').html(selectedRewardsString);
}


function generateSelectedAwardItem(reward) {
  rewardStartStingLowerCase = reward.rewardStart.charAt(0).toLowerCase() + reward.rewardStart.slice(1);
  return `
    <p>${reward.rewardName} starts ${rewardStartStingLowerCase}</p>`
}


function renderRewards() {
  //this will render the responsibilities and rewards as the
  //user schedules them
  let allRewardsMerged = [].concat.apply([], allRewards);
  console.log(allRewardsMerged);
  $('.rewards').html(allRewardsMerged);
  console.log('renderResponsibilitiesAndRewards ran');
  console.log(allRewardsMerged);
  //$('.eventbrite').html(rewardsArrayEventbrite);
  downloadSchedulePrompt();
}


function downloadSchedulePrompt() {
  $('.download-button').append(`
      <button class="download">Download Schedule</button>`); 
    $('.download').on('click', event => {
     
    console.log(wakeUpTime)
    console.log(tasksAndTimes)
    console.log(selectedRewards)

    let wakeUpTimeString = `I am going to wake up at ${wakeUpTime[0].wake}\n`
    let scheduledTasks = tasksAndTimes.map((task) => `From ${task.start} to ${task.end} I will ${task.activity}\n`) 
    let scheduledTasksWholeString = scheduledTasks.join()
    
    let scheduledRewards = selectedRewards.map((reward) => `My reward ${reward.rewardName} starts at ${reward.rewardStart}\n`) 
    let scheduledRewardsWholeString = scheduledRewards.join();

    fullScheduleString = `${wakeUpTimeString}\n${scheduledTasksWholeString}\n${scheduledRewardsWholeString}`;

    console.log(wakeUpTimeString);
    console.log(scheduledTasksWholeString);
    console.log(scheduledRewardsWholeString);

    downloadSchedule(fullScheduleString, 'schedule.txt');
    //$('.preamble').remove('this is the file', 'schedule.txt');
  });
  console.log('startScheduler ran!');
}


function downloadSchedule(text, filename) { 
  //create blob
  let blob = new Blob([text], {type: "text/plain"});

  //URL.createObjectURL() static method creates a DOMString containing
  //a URL representing the object given in the parameter.
  let url = window.URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  console.log(blob); 
}


function handleScheduler() {
  startScheduler();
  handleNewResponsibilitySubmit();
  handleTaskSubmit();
  scheduleReward();
}


$(handleScheduler);

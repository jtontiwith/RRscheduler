
const allRewards = [];
const wakeUpTime = [];
const tasksAndTimes = [];
const selectedRewards = [];


function startScheduler() {
  $('.wrapper').append(`
    <div class="preamble">
      <p>Welcome to Responsibility & Rewards Scheduler</p>
      <p>...this app does...press the button to get started...</p>
      <button>schedule my day</button>   
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
      <label for="wakeup-time">What time are you getting up?</label>
      <input id="wakeup-time" type="time" name="appt-time">
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
      <p>Ok, you gotta work starting at ${wakeUpTime[0].wake} like you said. Now, plan the tasks.</p>
   
    <fieldset class="js-task-starter">
      <label for="task-start-time">From</label>
      <input id="task-start-time" type="time" name="a">
      <label for="task-end-time">to</label>
      <input id="task-end-time" type="time" name="b">
      <label for="task-activity">I will do</label>
      <input id="task-activity" type="text" name="c">
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
    tasksAndTimes.push({
      start: taskStartTime,
      end: taskEndTime,
      activity: taskActivityName  
    })
    $('#task-start-time').val('');
    $('#task-end-time').val('');
    $('#task-activity').val('');
    console.log(tasksAndTimes);
    displayTasks();
  //generateTaskItemsString(tasksAndTimes);

  });
}

function generateTaskItemsString(tasklist) {
  const tasks = tasklist.map((task, index) => 
    generateTaskElement(task, index));
  // join together the strings
  return tasks.join("");
}

let j = 0;

function generateTaskElement(task, taskIndex) {
  j++
  if(j >= 7) { 
    console.log(j); 
    startRewardsFlow(); 
  }

  return `
    <p>From ${task.start} to ${task.end} I will work on ${task.activity}<p>`

}


function displayTasks() {
  const tasksString = generateTaskItemsString(tasksAndTimes);
    $('.js-task-display').html(tasksString);
}

function startRewardsFlow() {
$('.meetup').html(`
      <p class="rewards">Ok, you have scheduled reponsibilities, now time for some <button>Rewards</button></p>`); 
      
      $('.rewards').on('click', 'button', event => {
      $.getJSON('https://ipinfo.io/json', function(data){
       console.log(data)
       //grabbing the lat and lng out of sting that has them together 
       let lat = data.loc.split(',')[0];
       let lng = data.loc.split(',')[1];

       getInfoFromEventbrite(lat, lng);
    }) 

  });
  
  
}


//Eventbrite Token is... 2IECIQR5YEVJCHRLD7

function getInfoFromEventbrite(lat, lng) {
  console.log(`the lat is ${lat} and the lng is ${lng} here`); 
  const query = {
    'location.latitude': lat,
    'location.longitude': lng,
     token: 'YLHCYUV6MWY2WDN2EHYE',
    'location.within': '30mi',
    'start_date.keyword': 'tomorrow'
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


    
    
   // renderRewards(eventBriteHtmlWrappedResults);


}

// Meetup key is... 7f274db441d22481c12916293f201e

function getInfoFromMeetup(lat, lng) {

/*

  const query = {
    //key: '7f274db441d22481c12916293f201e',
    lat: lat,
    lon: lng,
    dataType: 'jsonp'
    //sign: true
    //sig_id: '189363096',
    //sig: '3d3dffd401a47afcedebbf4e854bc7667a05280d'
  }

  //https://api.meetup.com/2/open_events

  $.getJSON('https://api.meetup.com/2/open_events?and_text=False&offset=0&format=json&limited_events=False&page=200&radius=25.0&desc=False&status=upcoming&sig_id=189363096&sig=3d3dffd401a47afcedebbf4e854bc7667a05280d', query, function(data) {
    console.log(data);
  });
*/

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
    // error: function()
   
    
    //dateFilteredArray = data;
    //console.log(dateFilteredArray);

  //dateFilteredArray = data.results.filter(item => item.distance < 5);

    //console.log(dateFilteredArray);


  });


}

function filterMeetupInfo(apiResult) {
  console.log(apiResult.results);
  //getting current time and date and the time and date exacty 
  //two days in the future

  let Currenttime = new Date().getTime();
  let diff = 2880;
  let futureDate = new Date(Currenttime + diff*60000).getTime();
  console.log(Currenttime);
  console.log(futureDate);
  //filter the API results so that
  
  const filteredForDateRelevance = apiResult.results.filter(result => result.time < futureDate);
    
  const filteredAndHtmlWrappedResults = filteredForDateRelevance.map((filteredResult, index) => displayMeetupResults(filteredResult, index));

  allRewards.push(filteredAndHtmlWrappedResults);
  console.log('below this is the allRewards filled with meetup')
  console.log(filteredAndHtmlWrappedResults);
  //renderRewards(allRewards);
  

  //renderRewards();

  

  console.log(filteredForDateRelevance);
  console.log(filteredAndHtmlWrappedResults);

  renderRewards();
}

function displayMeetupResults(filteredApiResult, index) { 
  return `<li>
            <div data-item-index="${index}" style="border: 1px solid black">
              <div class="name">Name: ${filteredApiResult.name}</div>
              <div>Event Page: <a href="${filteredApiResult.event_url}">url</a></div>
              <div>Descripton: ${filteredApiResult.description}</div>
              <div>Photo URL: ${filteredApiResult.photo_url}</div>
              <div>RSVPed: ${filteredApiResult.yes_rsvp_count}</div>
              <div class="time">Time: ${new Date(filteredApiResult.time)}</div>
              <button class="js-reward-schedule">Schedule Reward</button>
            </div>
          </li>`;
}

/*

 <div>Event Page: <a href="${}">url</a></div>
              <div>Descripton: ${}</div>
              <div>Photo URL: ${}</div>
              <div>RSVPed: ${}</div>
              <div>Time: ${}</div>

*/



function displayEventbriteResults(eventBriteApiResult, index) { 
  return `<li>
            <div data-item-index="${index}" style="border: 1px solid black">
              <div class="name">Name: ${eventBriteApiResult.name.text}</div>
              <div class="time">Time: ${eventBriteApiResult.start.local} </div>
              <div>Time: <a href="${eventBriteApiResult.url}">url</a> </div>
              <button class="js-reward-schedule">Schedule Reward</button>
            </div>
          </li>`;
}

function scheduleReward() {
  $('.meetup').on('click', '.js-reward-schedule', event => {
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
  return `
    <p>My reward ${reward.rewardName} starts at ${reward.rewardStart}</p>`

}



function renderRewards() {
  //this will render the responsibilities and rewards as the
  //user schedules them
  let allRewardsMerged = [].concat.apply([], allRewards);
  console.log(allRewardsMerged);
  $('.meetup').html(allRewardsMerged);
  console.log('renderResponsibilitiesAndRewards ran');
  console.log(allRewardsMerged);
  //$('.eventbrite').html(rewardsArrayEventbrite);
  downloadSchedulePrompt();
}

function downloadSchedulePrompt() {
  $('.wrapper').append(`
    <div class="download">
      <p>Download your schedule</p>
      <button>Download Schedule</button>   
    </div>`); 
    $('.download').on('click', 'button', event => {
     
    console.log(wakeUpTime)
    console.log(tasksAndTimes)
    console.log(selectedRewards)

    let wakeUpTimeString = `I am going to wake up at ${wakeUpTime[0].wake}.`
    let scheduledTasks = tasksAndTimes.map((task) => `From ${task.start} to ${task.end} I am working on ${task.activity}.`) 
    let scheduledTasksWholeString = scheduledTasks.join()
    
    let scheduledRewards = selectedRewards.map((reward) => `My reward ${reward.rewardName} starts at ${reward.rewardStart}.`) 
    let scheduledRewardsWholeString = scheduledRewards.join();

    fullScheduleString = `${wakeUpTimeString}${scheduledTasksWholeString}${scheduledRewardsWholeString}`

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

/*
function download(text, filename){
  var blob = new Blob([text], {type: "text/plain"});
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

download("this is the file", "text.txt");
*/

}




function handleNewRewardSubmit() {
  //this will handle when a user submits a reward 


}


function deleteRewardOrResponsibility() {
  //this will delete a Reward or Responsibility 

}








function handleScheduler() {
  startScheduler();
  //setWakeUpTime();
  handleNewResponsibilitySubmit();
  handleTaskSubmit();
  scheduleReward();
}






$(handleScheduler);
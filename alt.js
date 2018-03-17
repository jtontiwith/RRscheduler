
const allRewards = [];
const tasksAndTimes = [];

const STATE = 'scheduleMode';


function startScheduler() {
  $('.wrapper').prepend(`
    <div class="preamble">
      <p>Welcome to Responsibility & Rewards Scheduler</p>
      <p>...this app does...press the button to get started...</p>
      <button>schedule my day</button>   
    </div>`); 
    $('.preamble').on('click', 'button', event => {
    setWakeUpTime();
    $('.preamble').remove();
  });

}


function setWakeUpTime() {
  $('.js-scheduler-form').html(`
    <fieldset class="js-schedule-starter">
      <label for="wakeup-time">What time are you getting up?</label>
      <input id="wakeup-time" type="time" name="appt-time">
      <button type='submit'>Submit</button>    
    </fieldset>`);
}


function handleNewResponsibilitySubmit() {
  //this will handle when a user submits a responsibility 
  console.log('handleNewResponsibilitySubmit ran');
  $('.js-scheduler-form').on('submit', event => {
    event.preventDefault();
    
    if (STATE==='scheduleMode') {
      console.log('yup, the event listener is runnin');
      let wakeTime = $('#wakeup-time').val();
      tasksAndTimes.push({wake: wakeTime});
      console.log(tasksAndTimes);
      console.log(event.currentTarget);
      $('.js-schedule-starter').remove();
      addTaskAndTime();
      //getUserLocation(); This initiates the whole reward 
      //showing flow of the app so let's leave it for now   
    } else if (STATE === 'taskMode') {
      let taskStart = $('#task-start-time').val();
    let taskEnd = $('#task-end-time').val();
    let taskActivity = $('#task-activity').val();
    console.log(event);
    console.log(taskActivity); 
    }
    
     

  });
}

function addTaskAndTime() {
  STATE = 'taskMode';
  
   $('.js-scheduler-form').html(`
      <p>Ok, you gotta work starting at ${tasksAndTimes[0].wake} like you said. Now, plan the tasks.</p>
   
    <fieldset class="js-task-starter">
      <label for="task-start-time">From</label>
      <input id="task-start-time" type="time" name="">
      <label for="task-end-time">to</label>
      <input id="task-end-time" type="time" name="">
      <label for="task-activity">I will do</label>
      <input id="task-activity" type="text" name="">
      <button type='submit'>Submit</button>
    </fieldset>`);

  }

  

//}

/*
What's the problem?

When I hit the submit button it's executing code that different 
than the code I want it to execute.


*/



 






function getUserLocation() {
  $.getJSON('https://ipinfo.io/json', function(data){
      console.log(data)
      //let city = data.city 
      //grabbing the lat and lng out of sting that has them together 
      let lat = data.loc.split(',')[0];
      let lng = data.loc.split(',')[1];

      getInfoFromEventbrite(lat, lng);
     

    })


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
 
  const eventBriteHtmlWrappedResults = data.events.map((one_event) => displayEventbriteResults(one_event));

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

function displayMeetupResults(filteredApiResult) { 
  return `<li>
            <div style="border: 1px solid black">
              <div>Name: ${filteredApiResult.name}</div>
              <div>Event Page: <a href="${filteredApiResult.event_url}">url</a></div>
              <div>Descripton: ${filteredApiResult.description}</div>
              <div>Photo URL: ${filteredApiResult.photo_url}</div>
              <div>RSVPed: ${filteredApiResult.yes_rsvp_count}</div>
              <div>Time: ${new Date(filteredApiResult.time)}</div>
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



function displayEventbriteResults(eventBriteApiResult) { 
  return `<li>
            <div style="border: 1px solid black">
              <div>Name: ${eventBriteApiResult.name.text}</div>
              <div>Time: ${eventBriteApiResult.start.local} </div>
              <div>Time: <a href="${eventBriteApiResult.url}">url</a> </div>

            </div>
          </li>`;
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

}






$(handleScheduler);


function startScheduler() {
  $('.js-schedule-starter').html(`
    <label for="wakeup-time">What time are you getting up?</label>
    <input id="wakeup-time" type="time" name="appt-time">
    <button type='submit'>Submit</button>`);



    
}




function renderResponsibilitiesAndRewards() {
  //this will render the responsibilities and rewards as the
  //user schedules them
  console.log('renderResponsibilitiesAndRewards ran');

}

function handleNewResponsibilitySubmit() {
  //this will handle when a user submits a responsibility 
  console.log('handleNewResponsibilitySubmit ran');
  $('.js-scheduler-form').on('submit', event => {
    event.preventDefault();
    console.log('yup, the event listener is runnin');
    let wakeTime = $('#wakeup-time').val();
    console.log(wakeTime);
    console.log(event.currentTarget);
    $('.js-schedule-starter').remove();
    getUserLocation();    

  });


}

function getUserLocation() {
  $.getJSON('https://ipinfo.io/json', function(data){
      console.log(data)
      //let city = data.city 
      
      
      //grabbing the lat and lng out of sting that has them together 
      let lat = data.loc.split(',')[0];
      let lng = data.loc.split(',')[1];

      getInfoFromEventbrite(lat, lng);
      getInfoFromMeetup(lat, lng);

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
    console.log(data);
    data.events.map(ebItem => {

    })


  });

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
  console.log(newDateObj);
  //filter the API results so that
  
  const filterForDateRelevance = apiResult.results.filter(result => result.time < futureDate);
  console.log(filterForDateRelevance);

}



function handleNewRewardSubmit() {
  //this will handle when a user submits a reward 


}


function deleteRewardOrResponsibility() {
  //this will delete a Reward or Responsibility 

}








function handleScheduler() {
  startScheduler();
  handleNewResponsibilitySubmit();

}






handleScheduler();
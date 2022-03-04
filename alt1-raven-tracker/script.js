const RS_Worlds = [1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,91,92,94,96,97,98,99,100,101,102,103,104,105,106,108,114,115,116,117,118,119,120,121,122,123,124,134,135,136,137,138,139,140,141,210,215,225,236,239,245,249,250,251,252,255,256,257,258,259]
const Raven_Location_Districts = ["Crwys","Crwys","Cadarn","Cadarn","Trahaearn","Iorwerth","Iorwerth","Iorwerth","Iorwerth"]
const Raven_Location_Description = [
  "Behind the building with Coeden inside the Crwys district",
  "East of the house east of the spirit tree",
  "South of the house with the spinning wheel (opposite entrance to Max Guild on the ledge)",
  "The window outside Haf's Battlestaves",
  "South of the Seren stones between the two buildings",
  "East of the Iorwerth church, on the southern ledge",
  "East of the Iorwerth church, on the ledge between the buildings",
  "West of the Iorwerth church",
  "West of the Rush of Blood entrance, south corner of the house"
]
function winningElement(array) {
  if (array.length == 0) return null;

  var modeMap = {},
    maxEl = array[0],
    maxCount = 1;

  for (var i = 0; i < array.length; i++) {
    var el = array[i];

    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;

    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    } else if (modeMap[el] == maxCount) {
      maxEl += "&" + el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}
function formatRavenLocation(text) {
  let lines = text.split('\n')
  let worlds = [];
  let locations = [];
  lines.forEach(element => {
    if (element.length > 0) {
      let tmp = element.split(':')
      let world = tmp[0].replace('w', '');
      if(RS_Worlds.includes(parseInt(world)))
        worlds.push(world);
      let location = tmp[1];
      locations.push(location);
      console.log("world : " + world + " location: " + location);
    }
  });
 // console.log(winningElement(worlds))
//  console.log(winningElement(locations))
  var winningWorld = winningElement(worlds)
  var winningLocation = parseInt(winningElement(locations))
  
  var html = "Users last reported Raven on <strong>World "
  + winningWorld +"</strong> in <strong>"
  + Raven_Location_Districts[winningLocation] 
  +" District - "+Raven_Location_Description[winningLocation]+"</strong><br><br><i>If you see multiple worlds / locations this means there is no clear winner and reports are mixed.<br>Please report your findings to clarify results and help others.</i>"
  
  var img = "<img src='images/"+(winningLocation +1) +".jpg>"
  document.getElementById("status").innerHTML=html;
  document.getElementById("statusImage").src = "images/"+(winningLocation +1) +".jpg"
  document.getElementById("statusImage").style.display= "block";


}
var i = 0;
async function getRaven() {
 // console.log("raven!!!");
  document.getElementsByClassName("result-container")[0].style.display = "block"
  
  formatRavenLocation(serverData);
  //document.getElementById("status").innerText = serverData;
}
var serverData = "";
function getLastRavenLocation() {
  serverData = fetchFromServer('https://raventracker.sytes.net/votes');
  document.getElementById("status").innerText = "Raven Seen at";
}

function fetchFromServer(url) {
  const invocation = new XMLHttpRequest();
  var ret = "";
  if (invocation) {
    invocation.open('GET', url, true);
    invocation.withCredentials = false;
    invocation.onreadystatechange = function () {
      // In local files, status is 0 upon success in Mozilla Firefox
      if (invocation.readyState === XMLHttpRequest.DONE) {
        var status = invocation.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          // The request has been completed successfully
          //console.log(invocation.responseText);
          serverData = invocation.responseText;
          console.log(serverData);
        } else {
          // Oh no! There has been an error with the request!
          serverData = invocation.statusText;
          console.log(serverData);
        }
      }
    };
    invocation.send();

  }

}
function postVoteToServer(w, l){
  const invocation = new XMLHttpRequest();
  var url = "https://raventracker.sytes.net/vote/w"+w+"/"+l
  var ret = "";
  if (invocation) {
    invocation.open('GET', url, true);
    invocation.withCredentials = false;
    invocation.onreadystatechange = function () {
      // In local files, status is 0 upon success in Mozilla Firefox
      if (invocation.readyState === XMLHttpRequest.DONE) {
        var status = invocation.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          // The request has been completed successfully
          //console.log(invocation.responseText);
          
          console.log(serverData);
        } else {
          // Oh no! There has been an error with the request!
          
          console.log(serverData);
        }
      }
    };
    invocation.send();

  }
}

function isTodayRavenSpawn(){
  var lastSpawn = diff(Math.floor(Date.now() / 1000), closestSpawn() - 1123200)
  if( lastSpawn.indexOf("Day") === -1){
    console.log("spawned!")
    return true;  
  } else {
    console.log("waiting for spawn")
    return false;
    }
}

var futureDates = [];
function closestSpawn() {
  var spawn = 1646006400;
  var offset = 1123200;

  var dateNow = Math.floor(Date.now() / 1000)

  while (dateNow > spawn) {
    spawn += offset;
  }
  return spawn
}
function generateDatesFromNow(cycles) {
  futureDates.push(closestSpawn());
  for (let i = 0; i < cycles; i++) {
    futureDates.push(futureDates[i] + 1123200);
  }
  return futureDates;
}
function unixToDate(unixTime) {
  const date = new Date(unixTime * 1000);
  return date.toLocaleDateString("en-GB");
}
function diff(date1, date2) {
  var difference = date1 - date2;

  var daysDifference = Math.floor(difference / 60 / 60 / 24);
  difference -= daysDifference * 60 * 60 * 24

  var hoursDifference = Math.floor(difference / 60 / 60);
  difference -= hoursDifference * 60 * 60

  var minutesDifference = Math.floor(difference / 60);
  difference -= minutesDifference * 60

  result = "";
  if (daysDifference == 1) result += "1 Day ";
  if (daysDifference > 1) result += daysDifference + " Days ";

  if (hoursDifference == 0) result += "0 Hours ";
  if (hoursDifference == 1) result += "1 Hour ";
  if (hoursDifference > 1) result += hoursDifference + " Hours ";

  if (minutesDifference == 0) result += "0 Minutes ";
  if (minutesDifference == 1) result += "1 Minute ";
  if (minutesDifference > 1) result += minutesDifference + " Minutes ";


  return result;
}
function submitVote(){
  var selectedWorld = document.getElementById("worldList").value
  var selectedDistrict = document.getElementById("districtList").value

  console.log(selectedWorld,selectedDistrict);
  postVoteToServer(selectedWorld, selectedDistrict)

}
function setupVotingControls(){
  var html = '<select name="world" id="worldList" class="nisdropdown"></select><select name="district" id="districtList" class="nisdropdown"></select><div id="unlockbutton" class="nisbutton" onclick="submitVote();">Submit Vote</div>'
  html+='<hr><h3>Disclaimer:<br> I put a lot of effort into removing invalid and false reports but due to the nature of crowdsourcing, there is no way to completely eradicate griefers. '
  html+= '<br>The server-side algorhythm will be fine tuned as the time goes by and results will be more coincise.'
  html+='<br><br>Thank you for your patience and support!<br> '
  document.getElementById("voting").innerHTML = html;
}
function openVoting(){
  setupVotingControls()
  var worldlist = document.getElementById("worldList")
  var districtlist = document.getElementById("districtList")

  RS_Worlds.forEach(world => {
    worldlist.innerHTML+="<option value="+world+">World "+world+"</option>"
  });

  for (let i = 0; i < Raven_Location_Districts.length; i++) {
    const element = Raven_Location_Districts[i] + " / "+ Raven_Location_Description[i];
    districtlist.innerHTML+="<option value="+i+">"+element+"</option>"
  }
}
function refreshResult() {
  var resultEl = document.getElementById("result");
  resultEl.style.display = "block";
  resultEl.innerHTML = "";
  futureDates = [];
  var nextSpawn = closestSpawn();
  var dates = generateDatesFromNow(5);
  var lastSpawn = diff(Math.floor(Date.now() / 1000), closestSpawn() - 1123200)
  if(!isTodayRavenSpawn()){
  var res = "Raven last spawned " + lastSpawn + " ago.<br>Next spawn dates: <br><ul>";

  for (let x = 0; x < dates.length; x++) {
    res += "<li>" + unixToDate(dates[x]) + " - " + diff(dates[x], Math.floor(Date.now() / 1000)) + "</li>";
    //console.log(unixToDate(dates[x]));
    //   console.log(diff( dates[x], Math.floor(Date.now()/1000)))
  }
}

  res += "</ul>";
  resultEl.innerHTML = res;
  // console.log(lastSpawn);
  setTimeout(function(){
    if(isTodayRavenSpawn()){
      getRaven();
      openVoting();
    } else {

    }
    
 }, 500);//wait 2 seconds
  

  //console.log(calculateNewDate(new Date(2022,1,28,0)).toString());
}
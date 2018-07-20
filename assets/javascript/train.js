// Initialize Firebase
var config = {
  apiKey: "AIzaSyAumhErD4-5vCSG0esVUUscWPXMEGxeT4M",
  authDomain: "trainproject-9e522.firebaseapp.com",
  databaseURL: "https://trainproject-9e522.firebaseio.com",
  projectId: "trainproject-9e522",
  storageBucket: "trainproject-9e522.appspot.com",
  messagingSenderId: "598145314487"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainName;
var destinationInput;
var frequencyMin;
var firstTrainTime;

// Function definition to recieve input from form and put it into Firebase.
function formDataToFirebase() {
  event.preventDefault();

  trainName = $("#trainName").val().trim();
  destinationInput = $("#destinationInput").val().trim();
  firstTrainTime = $("#firstTrainTime").val().trim();
  frequencyMin = $("#frequencyMin").val().trim();

  //Moment.JS for converting time

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  // formats the current time into hours and minutes
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequencyMin;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = frequencyMin - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var nextTrainArrival = moment(nextTrain).format("hh:mm");

  // Push data into database
  database.ref().push({
    trainName: trainName,
    destinationInput: destinationInput,
    firstTrainTime: firstTrainTime,
    frequencyMin: frequencyMin,
    nextArrival: nextTrainArrival,
    minAway: tMinutesTillTrain
  });

  // To check if the values were correct
  // console.log(trainName);
  // console.log(destinationInput);
  // console.log(firstTrainTime);
  // console.log(frequencyMin);

  $("#trainName").val("");
  $("#destinationInput").val("");
  $("#firstTrainTime").val("");
  $("#frequencyMin").val("");

};

//Function definition to display the firebase data in the table
function firebaseDataToSchedule(snapshot) {

  var trainInfo = snapshot.val();


  // To make sure the data from the firebase was being stored properly
  // console.log(trainInfo.trainName);
  // console.log(trainInfo.destinationInput);
  // console.log(trainInfo.firstTrainTime);
  // console.log(trainInfo.frequencyMin);

  $("#trainSchedulesInput").append(
    "<tr>" +
    "<td scope='col'>" +
    trainInfo.trainName +
    "</td>" +
    "<td scope='col'>" +
    trainInfo.destinationInput +
    "</td>" +
    "<td scope='col'>" +
    trainInfo.frequencyMin +
    "</td>" +
    "<td scope='col'>" +
    trainInfo.nextArrival +
    "</td>" +
    "<td scope='col'>" +
    trainInfo.minAway +
    "</td>"
  );

};

//On-click function for the submit button
$("#add-train").on("click", formDataToFirebase);

//Event listener for whenever a child gets added to the firebase database.
database.ref().on("child_added", firebaseDataToSchedule);

//Refreshes the page
// $("#refreshbtn").on("click", function(refresh){

//   trainInfo = refresh.val();

//   database.ref().trainInfo.forEach(function(){
//       //Moment.JS for converting time

//   // First Time (pushed back 1 year to make sure it comes before current time)
//   var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
//   console.log(firstTimeConverted);

//   // Current Time
//   // formats the current time into hours and minutes
//   var currentTime = moment();
//   console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

//   // Difference between the times
//   var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
//   console.log("DIFFERENCE IN TIME: " + diffTime);

//   // Time apart (remainder)
//   var tRemainder = diffTime % frequencyMin;
//   console.log(tRemainder);

//   // Minute Until Train
//   var tMinutesTillTrain = frequencyMin - tRemainder;
//   console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

//   // Next Train
//   var nextTrain = moment().add(tMinutesTillTrain, "minutes");
//   var nextTrainArrival = moment(nextTrain).format("hh:mm");
//   });

// })



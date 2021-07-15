// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyDraFFr_DIqR9uoQWuzzXqZr4A2T_-ckhA",
  authDomain: "task1-7c83d.firebaseapp.com",
  projectId: "task1-7c83d",
  storageBucket: "task1-7c83d.appspot.com",
  messagingSenderId: "657942298822",
  appId: "1:657942298822:web:4fa250a1c659003aced7c7",
  measurementId: "G-4ZL3EFZB1G",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//validating input file
validateFile = () => {
  const acceptedExtension = ["jpg", "jpeg", "png", "pdf"];
  const fileName = document.getElementById("file").files[0].name;
  const fileExtension = fileName
    .substring(fileName.lastIndexOf(".") + 1, fileName.length)
    .toLowerCase();
  if (!acceptedExtension.includes(fileExtension)) {
    alert("please upload only jpg, jpeg, png, and pdf files");
    document.getElementById("file").value = null;
  }
};
document.getElementById("file").addEventListener("change", validateFile);

//uploading to firebase
upload = () => {
  //get file
  var file = document.getElementById("file").files[0];

  //rename file name
  var dateTime = new Date();
  var timeMS = dateTime.getTime();
  var fileName = timeMS;

  //firebase storage
  var storageRef = firebase.storage().ref("files/" + fileName);

  //upload image to firebase storage
  var uploadTask = storageRef.put(file);

  //progressbar
  const progressBarElement = document.querySelector(".progress-bar");
  const progressNotifElement = document.getElementById("progress-notif");

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      //handle progress
      //state change event progress
      //get task progress using number of bytes uploaded and total
      var progress = snapshot.bytesTransferred / snapshot.totalBytes;
      progressBarElement.style.transform = `scaleX(${progress})`;
      progressNotifElement.innerHTML = progress * 100 + "%";
      console.log("upload is " + progress * 100 + " done");
    },
    (error) => {
      //handle error
      console.log(error.message);
    },
    () => {
      //handle success
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        var fileExtension = file.name
          .substring(file.name.lastIndexOf(".") + 1, file.name.length)
          .toLowerCase();
        const container = document.querySelector(".show-file");
        const acceptedImgExtension = ["png", "jpg", "jpeg"];
        //show image
        if (acceptedImgExtension.includes(fileExtension)) {
          var img = document.createElement("img");
          img.style.width = "100%";
          img.style.height = "100%";
          img.src = downloadURL;
          container.appendChild(img);
        }
        //show pdf
        else if (fileExtension == "pdf") {
          var pdf = document.createElement("embed");
          pdf.style.width = "100%";
          pdf.style.height = "100%";
          pdf.src = downloadURL;
          container.appendChild(pdf);
        }
      });
      progressBarElement.classList.add("ended");
    }
  );
};

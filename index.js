const taskContainer = document.querySelector(".task__container")

// creating  Storage for storing data and converting from here to HTML to display on refresh
let globalStore = [];

const generateNewCard = (taskData) =>{
   const newCard = `<div class="col-md-6 col-lg-4 my-2">
                     <div class="card text-center rounded-3">
                        <div class="card-header d-flex justify-content-end gap-2">
                           <button type="button" class="btn btn-outline-info" id=${taskData.id} onclick="editCard.apply(this,arguments)">
                              <i class="fa-solid fa-pencil" id=${taskData.id} onclick="editCard.apply(this,arguments)"></i>
                           </button>
                           <button type="button" class="btn btn-outline-danger" id=${taskData.id} onclick="deleteCard.apply(this,arguments)">
                              <i class="fa-solid fa-trash-can" id=${taskData.id} onclick="deleteCard.apply(this,arguments)"></i>
                           </button>
                        </div>

                        <img src="${taskData.imageUrl}"
                           class="card-img-top" alt="...">
                        <div class="card-body">
                        <h5 class="card-title">${taskData.taskTitle}</h5>
                        <p class="card-text">${taskData.taskDescription}</p>
                        </div>

                        <div class="card-footer text-muted">
                        <button type="button" class="btn btn-outline-primary float-end" id=${taskData.id}>Open Task</button>
                        </div> 
                     </div>
                  </div>`
      return newCard 
};

const loadInitialCardData = () =>{
   //local storage to get data
   const getCardData = localStorage.getItem("tasky");

   // convert to normal object from string
   //Destucturing Concept used
   const {cards} = JSON.parse(getCardData);
   // if(cards.length>0){
      //loop over to create HTML card
      cards.map((cardObject) => {
         // injecting it to DOM
         taskContainer.insertAdjacentHTML("beforeend",generateNewCard(cardObject)) 
         //Update globalStore
         globalStore.push(cardObject)
      })
   // }
   // console.log(cards.length);
   
};

const saveChanges = () => {
   const taskData = {
      id : `${Date.now()}`, //unique number
      imageUrl : document.getElementById("imageurl").value,
      taskTitle : document.getElementById("tasktitle").value,
      taskDescription : document.getElementById("taskdescription").value,
   };

   taskContainer.insertAdjacentHTML("beforeend",generateNewCard(taskData)) 

   //local storage
   globalStore.push(taskData)
   localStorage.setItem("tasky", JSON.stringify({cards: globalStore})); // (id, storage)
};


// Issue :- Data get lost on refresh so using Local Storage to store Tasks in my System.

const deleteCard = (event) => {
   //event :- contains the all browser related information
   //get id
   event = window.event;  // window parent of browser
   const targetID = event.target.id;
   const tagname = event.target.tagName;

   // find id in global store and delete if found = NOT WORK as deletion will be done in random
   //So we create a new array without that element which is clicked for deletion
   const newArray = globalStore.filter((cardObject) =>
      cardObject.id !== targetID
   );

   globalStore = newArray;
   localStorage.setItem("tasky", JSON.stringify({cards: globalStore})); //UPDATING local storage

   if(tagname==="BUTTON"){              // this is address of that child
      return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);//delets and again render the items on its own
   }else{
      return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
   }

   //contact parent
}

// contenteditable = "true" :- When this attribut is added to any item then it can be edit
// What we are doing here is telling js that on clicking on edit button add this feature to corresponding taks items.
const editCard = (event) =>{
   event = window.event;
   const targetID = event.target.id;
   const tagename = event.target.tagName;

   let parentElement;
   if(tagename==="BUTTON"){
      parentElement = event.target.parentNode.parentNode;
   }else{
      parentElement = event.target.parentNode.parentNode.parentNode;
   }

   let taskTitle = parentElement.childNodes[5].childNodes[1];
   let taskDescription = parentElement.childNodes[5].childNodes[3];

   let saveButton = parentElement.childNodes[7].childNodes[1];
   // console.log(parentElement.childNodes[7].childNodes[1]);

   //setAttribute

   taskTitle.setAttribute("contenteditable","true");
   taskDescription.setAttribute("contenteditable","true");
   saveButton.setAttribute("onclick","saveEditChanges.apply(this,arguments)");

   saveButton.innerHTML = "Save Changes"

};

const saveEditChanges = (event) =>{
   event = window.event;
   const targetID = event.target.id;
   const tagename = event.target.tagName;

   let parentElement;
   if(tagename==="BUTTON"){
      parentElement = event.target.parentNode.parentNode;
   }else{
      parentElement = event.target.parentNode.parentNode.parentNode;
   }

   let taskTitle = parentElement.childNodes[5].childNodes[1];
   let taskDescription = parentElement.childNodes[5].childNodes[3];
   let saveButton = parentElement.childNodes[7].childNodes[1];

   const updatedData = {
      taskTitle : taskTitle.innerHTML,
      taskDescription : taskDescription.innerHTML,
   };


   // console.log({ updatedData });
   globalStore = globalStore.map((task) =>{
      if(task.id === targetID){
         return {
            id :task.id, //unique number
            imageUrl : task.imageUrl,
            taskTitle : updatedData.taskTitle,
            taskDescription : updatedData.taskDescription,
         };
      }
      return task;
   })

   localStorage.setItem("tasky", JSON.stringify({cards: globalStore})); // (id, storage)

   taskTitle.setAttribute("contenteditable","false");
   taskDescription.setAttribute("contenteditable","false");
   saveButton.removeAttribute("onclick");
   saveButton.innerHTML = "Open Task"
}


function getDate(){
   var todaydate = new Date();
   var day = todaydate.getDate();
   var month = todaydate.getMonth() + 1;
   var year = todaydate.getFullYear();
   var datestring = day + "/" + month + "/" + year;
   document.getElementById("frmDate").value = datestring;
  } 


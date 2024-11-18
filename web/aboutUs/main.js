const counteEl = document.querySelectorAll('.couter-users')
/**The reason i have use querySelectorAll to select all and also remember it works like array but not exactly array */

let count = 0;
let download = 0
let feedback = 0
//* using setInterval here becasue i want to repeat the numbers
let updateCounter = setInterval(()=>{

   //* Active Users
    if(count < 140){
        count++ 
        counteEl[0].textContent = count
       
    }
    //* Total Download
    if(download < 12){
        download++;
        counteEl[1].textContent = download;

        // * clearInterval(updateCounter) if u use here every thing will stp

        //* Total Transaction
        counteEl[3].textContent = download
        
       
    }
    if(feedback < 99.5){
        feedback+=0.5;
        counteEl[2].textContent =feedback.toFixed(1) 
    }

    //* To stop when reaches max number each one
   if(count > 140 && download > 12 && feedback > 99.5){
    clearInterval(updateCounter)
    //* why did i used clearInterval here? Used clearInterval here to stop the interval once all  conditions are met
   }

},50)
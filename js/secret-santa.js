
var link_root = "https://www.designedbycave.co.uk/secret-santa?s=";
var link_version = "v1";
var link_random_data = Math.random().toString(36).substr(2, 12);


function process_url_data(){
   var url_params = new URLSearchParams(window.location.search);
   var data_string = url_params.get('s');

   if(!data_string || data_string == ""){
      // error -> no data string at all
      return {
         error: true,
         no_string: true
      };
   }

   var data_parts = data_string.split('.');
   if(data_parts.length != 3){
      // error -> string not valid
      return {
         error: true,
         msg: "There is a problem with the link you followed. [0]"
      };
   }else if(data_parts[0] != 'v1'){
      // error -> incorrect version found
      return {
         error: true,
         msg: "There is a problem with the link you followed. [1]"
      };
   }

   var list_data = atob(data_parts[2]).split('|');
   if(list_data.length != 2){
      // error -> compressed data not valid
      return {
         error: true,
         msg: "There is a problem with the link you followed. [2]"
      };
   }
   var names = list_data[0].split('/');
   var order = list_data[1].split('/');
   if(names.length != order.length){
      // error -> incorrect mapping of names to lengths found
      return {
         error: true,
         msg: "There is a problem with the link you followed. [3]"
      };
   }

   return {
      error: false,
      data_string: data_string,
      names: names,
      order: order
   }
}

function save_pairing(data_string, your_name, for_name){
   localStorage.setItem(data_string, your_name + "|" + for_name);
}

function check_for_stored(data_string){
   var found = localStorage.getItem(data_string);
   if(found && found != ""){
      var found_parts = found.split("|");
      if(found_parts.length == 2){
         return {
            error: false,
            your_name: found_parts[0],
            for_name: found_parts[1]
         };
      }
   }
   return {
      error :true
   };
}

function clean_data(raw_names){
   // Remove blank names and strange characters
   for(i=0; i<raw_names.length; i++){
      raw_names[i] = raw_names[i].trim().replace(/[^a-zA-Z\-'À-ÿ ]+/,''); // Trim anything we don't want
      if(/^\s*$/.test(raw_names[i])){
         raw_names.splice(i,1);
         i--;
      }
   }
   return raw_names;
}

// Assumes that data is clean
function generate_link(names_array){

   // Check for duplicates
   if(names_array.length < 3){
      return {
         error: true,
         msg: "You forgot to enter at least three names"
      };
   }
   if(!is_array_unique(names_array)){
      return {
         error: true,
         msg: "You have a duplicate name in your list"
      };
   }
   
   var names = names_array.join("/");
   var mapping = Array.from(Array(names_array.length),(e,i)=>i+1);
   var shuffled = shuffle_no_repeat(mapping);
   
   var link = link_root + [link_version,link_random_data,btoa(names + "|" + shuffled.join("/"))].join(".");
   
   return {
      error: false,
      msg: link
   };
}


// //////////////////////////////
// Math array helper functions
// //////////////////////////////

function shuffle_no_repeat(a){
   var loops=0;
   do {
      shuffle(a);
      loops++;
   } while (!check(a));
   return a;
}

function shuffle(a) {
   var j, x, i;
   for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
   }
   return a;
}
function check(a){
   for(i = 0; i<a.length; i++){
      if(a[i] == (i+1)){
         return false;
      }
   }
   return true;
}	

function is_array_unique(myArray){
   for (var i = 0; i < myArray.length; i++){
      if (myArray.indexOf(myArray[i]) !== myArray.lastIndexOf(myArray[i])){ 
            return false; 
      } 
   } 
   return true;
}	
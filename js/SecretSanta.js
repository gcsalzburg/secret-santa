
class SecretSanta{

	_default_opts = {
		link_root: 			"https://play.interactionmagic.com/secret-santa?s=",
		link_version: 		"v2",
		link_random_data:	Math.random().toString(36).substr(2, 12),

		max_computation_loops: 10000
	}

	error = {
		msg: '',
		code: 0
	}

	constructor(opts) {
		// Merge opts with defaults
		this.opts = {...this._default_opts, ...opts}
	}

	get_error(){
		return this.error
	}

	// //////////////////////////////////////////////////////////////////
	// Process out data from incoming URL
	process_url_data(){

		const url_params = new URLSearchParams(window.location.search)
		const data_string = url_params.get('s')

		if(!data_string || data_string == ""){
			// error -> no data string at all
			this.error = {
				msg: "No data string supplied",
				code: 1
			}
			return false
		}

		const data_parts = data_string.split('.');
		if(data_parts.length != 3){
			this.error = {
				msg: "String not valid",
				code: 2
			}
			return false
		}else if(data_parts[0] != this.opts.link_version){
			this.error = {
				msg: "Incorrect link version supplied",
				code: 3
			}
			return false
		}

		let list_data
		try{
			list_data = atob(data_parts[2]).split('|');
		}catch(e){
			this.error = {
				msg: "Link data corrupt",
				code: 6
			}
			return false
		}
		if(list_data.length != 2){
			this.error = {
				msg: "Compressed data invalid",
				code: 4
			}
			return false
		}
		const names = list_data[0].split('/');
		const order = list_data[1].split('/');
		if(names.length != order.length){
			// error -> incorrect mapping of names to lengths found
			this.error = {
				msg: "Incorrect mapping of names to lengths found",
				code: 5
			}
			return false
		}

		// Save all the data internally
		this.data = {
			string: data_string,
			names: names,
			order: order
		}

		return true
	}

	// Get the receiver for the given name
	get_receiver(check_name){
		for(let i=0; i<this.data.names.length; i++){
			if(check_name == this.data.names[i]){

				const receiver = this.data.names[this.data.order[i]-1]

				// Save this pairing for next time
				this.save_name(check_name, receiver)

				// Return the name
				return receiver
			}
		}
		return false
	}

	// Return number of names in this list
	get_num_names(){
		return this.data.names.length
	}

	// //////////////////////////////////////////////////////////////////
	// Storage of checked values

	// Check if we already have a stored entry for this URL
	check_for_stored(){
		const found = localStorage.getItem(this.data.string);
		if(found && found != ""){
			const found_parts = found.split("|");
			if(found_parts.length == 3){
				return {
					your_name: 		found_parts[0],
					for_name: 		found_parts[1],
					number_names: 	found_parts[2]
				};
			}
		}
		return false
	}
	
	save_name(your_name, receiver){
		if(this.data){
			localStorage.setItem(this.data.string, your_name + "|" + receiver + "|" + this.data.names.length)
		}
	}

	// //////////////////////////////////////////////////////////////////
	// Name lists input/output

	// Takes raw list of names separated by new lines and commas and saves them 
	add_names(raw_names){

		// Convert input into 2-dimensional array separated by new lines and commas
		const names_array = raw_names.split(/\r?\n/)
		for(let n=0; n<names_array.length; n++){
			names_array[n] = names_array[n].split(',')
		}

		// Replace blank names and strange characters in array with blank entries
		for(let i=0; i<names_array.length; i++){
			for(let j=0; j<names_array[i].length; j++){
				names_array[i][j] = names_array[i][j].trim().replace(/[^a-zA-Z\-'À-ÿ ]+/,'') // Trim anything we don't want
				if(/^\s*$/.test(names_array[i][j])){
					names_array[i].splice(j,1)
					j--
				}
			}
		}

		// Now remove blank rows with no valid names left in them
		for(let i=0; i<names_array.length; i++){
			if(names_array[i].length == 0){
				names_array.splice(i,1)
				i--
			}
		}

		this.names = names_array
	}

	// Returns the saved names in format suitable for the textarea box
	get_names_for_textarea(){
		if(!this.names){
			return
		}

		const return_names = [...this.names]
		for(let i=0; i<return_names.length; i++){
			return_names[i] = return_names[i].join(', ')
		}
		return return_names.join('\r\n')
	}

	// //////////////////////////////////////////////////////////////////
	// Generates a unique shuffling for the array of names

	shuffle_and_generate_link(){

		// Check for errors in data
		if(this.names.length < 2){
			return {
				error: true,
				msg: "You forgot to enter at least two groups of names"
			}
		}
		if(this.names.flat().length < 3){
			return {
				error: true,
				msg: "You forgot to enter at least three names"
			}
		}
		if(!this._is_array_unique(this.names.flat())){
			return {
				error: true,
				msg: "You have a duplicate name in your list"
			}
		}
		
		// Create array of integers equal to length of names array
		this.mapping = Array.from(Array(this.names.flat().length),(e,i)=>i)

		// Calculate the shuffling
		// Shuffle this array until there are no self-matches
		// This returns an array of who each index is buying for
		const computation_loops = this._shuffle_until_no_self_matches(this.mapping)

		if(computation_loops >= this.opts.max_computation_loops){
			// No solution was found
			return {
				error: true,
				msg: "No matching solution was found, please try again."
			}
		}

		// Create structure of final results which we can return
		const results = {}
		for(let n=0; n<this.mapping.length; n++){
			results[this.names.flat()[n]] = this.names.flat()[this.mapping[n]]
		}
				
		return {
			error: 					false,
			msg: 						"Generation finished",
			results: 				results,
			names:					this.mapping.length,
			computation_loops:	computation_loops,
			link: 					this._build_link()
		};
	}

	// //////////////////////////////////////////////////////////////////
	// Builds a link for this generation based on the saved shuffled data 

	_build_link(){

		const link_data = [
			this.opts.link_version,
			this.opts.link_random_data,
			btoa(this.names.flat().join("/") + "|" + this.mapping.join("/"))
		].join(".")

		return `${this.opts.link_root}${link_data}`
	}

	// //////////////////////////////////////////////////////////////////
	// Shuffle and check functions
	// Very crude and inefficient, but it works!

	// Shuffles array until there are no self matches
	_shuffle_until_no_self_matches(shuffled_array){
		let loops=0
		do {
			this._shuffle(shuffled_array)
			++loops
		} while (!this._check_array_for_matches(shuffled_array) && loops<this.opts.max_computation_loops)

		return loops
	}

	// Check if any element is in the array
	_check_array_for_matches(shuffled_array){
		for(let i = 0; i<shuffled_array.length; i++){
			if(this._get_array_with_name_in(this.names.flat()[i]).includes(this.names.flat()[shuffled_array[i]])){
				return false
			}
		}
		return true;
	}	

	// Get the sub-array with this name in
	_get_array_with_name_in(name){
		for(let n of this.names){
			if(n.includes(name)){
				return n
			}
		}
	}

	// //////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////
	// Math array helper functions

	_shuffle(a) {
		let j, x, i;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}

	_is_array_unique(myArray){
		for (var i = 0; i < myArray.length; i++){
			if (myArray.indexOf(myArray[i]) !== myArray.lastIndexOf(myArray[i])){ 
					return false; 
			} 
		} 
		return true;
	}	
}
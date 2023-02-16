'use strict'

document.addEventListener('DOMContentLoaded', () => {

	// Save reference to name input box
	const name_input = document.querySelector('.check-name')

	// Renders the new result to the screen, we have a match!
	const render_result = (your_name, for_name, number_names) => {
		document.querySelector('.for-name').textContent = for_name;
		document.querySelector('.your-name').textContent = your_name;
		document.querySelector('.number-names').textContent = number_names;
		document.body.classList.add('show-results')
	}

	// //////////////////////////////////////////////////////////
	// UI control

	// Helpers for UI clicks
	name_input.addEventListener("focus",function(e){
		hide_error();
	});
	

	// Submit capture on name entry form
	document.querySelector('.check-form').addEventListener("submit",function(e){
		e.preventDefault();

		// Capture name input
		const check_name = name_input.value.trim()

		// Paste back trimmed name
		name_input.value = check_name

		if(check_name == ""){
			show_error("Please fill in your name above", name_input)
			return
		}

		// Now find the name in the list!
		let for_name = Santa.get_receiver(check_name)
		if(!for_name){
			show_error("Sorry, we can't find that name in this list, try again?", name_input)
		}else{
			render_result(check_name, for_name, Santa.get_num_names())
		}
	});


	// //////////////////////////////////////////////////////////
	// When page loads...

	// Check inbound link, if one exists
	if(Santa.process_url_data()){

		document.body.classList.add('show-check')

		// If it passes ok, then check we haven't already processed and saved to localStorage a match for this URL
		const check_storage = Santa.check_for_stored();
		if(check_storage){
			render_result(check_storage.your_name, check_storage.for_name, check_storage.number_names)
		}
	}else{
		const error = Santa.get_error()
		if(error.code == 1){
			console.log("No link found")
		}else{
			show_error(`There was a problem with the link you followed. [${error.code}]`, document.querySelector('.check-panel'))
		}
	}
})
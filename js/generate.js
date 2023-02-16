'use strict'

document.addEventListener("DOMContentLoaded", () => {
	
	// UI handling for this page below
	// DOM References
	const link_input  = document.getElementById("link")
	const names_input = document.getElementById("names")

	// Focus and select handlers to help things along
	names_input.addEventListener("focus",(e) => {
		hide_error();
	});
	link_input.addEventListener("focus",(e) => {
		link_input.select();
	});

	// When submitting names, pass them to generator and generate response
	document.querySelector('.names-form').addEventListener("submit",function(e){
		e.preventDefault();

		// Pass in the names from the box
		Santa.add_names(names_input.value)
		names_input.value = Santa.get_names_for_textarea() // Set textarea to our cleaned output

		// Generate the link
		const response = Santa.shuffle_and_generate_link()
		if(response.error){
			show_error(response.msg, names_input)
		}else{
			link_input.value = response.link
			document.body.classList.add('show-link')
		}
	});
})
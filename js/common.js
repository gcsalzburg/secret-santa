'use strict'

// Initialise SecretSanta
const Santa = new SecretSanta()

// Show / hide errors
const show_error = (msg, after_node) => {
	// Hide old errors first, so we only show one at a time
	hide_error();

	// Show new errors
	after_node.insertAdjacentHTML('afterEnd',`<div class="error-panel">${msg}</div>`)
}
const hide_error = () => {
	document.querySelectorAll('.error-panel').forEach(error => error.remove())
}

document.addEventListener('DOMContentLoaded', () => {



	// Toggle for help button
	document.querySelector(".help-button").addEventListener("click", function(e){
		e.preventDefault();
		document.body.classList.toggle('show-help')
	})

})
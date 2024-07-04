//loader js starts

var $loader = document.querySelector(".loader");

window.onload = function () {
	$loader.classList.remove("loader--active");
};

document.querySelector(".btn").addEventListener("click", function () {
	$loader.classList.add("loader--active");

	window.setTimeout(function () {
		$loader.classList.remove("loader--active");
	}, 5000);
});

//loader js ends





function myFunction() {
	document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {
	  var dropdowns = document.getElementsByClassName("dropdown-content");
	  var i;
	  for (i = 0; i < dropdowns.length; i++) {
		var openDropdown = dropdowns[i];
		if (openDropdown.classList.contains('show')) {
		  openDropdown.classList.remove('show');
		}
	  }
	}
  }














  var loadFile = function (event) {
	var image = document.getElementById("output");
	image.src = URL.createObjectURL(event.target.files[0]);
  };
  
  






  






  
window.onload = function(){
	$.ajax({ url: "utility/mainSideBar.txt"})
		.done(function(file_content) {
			var loc = window.location.pathname;
			var dir = loc.substring(loc.lastIndexOf('.com') + 4);
			if(dir.includes("/projects")){
				injection(file_content, "Projects");
			}
			else if(dir.includes("/journal")){
				injection(file_content, "Journal");
			}
			else{
				injection(file_content, "Home");
			}
		})
		.fail(function(){
			document.getElementById("sidebar").innerHTML = "failed to load sidebar data";
		});
}

//Project folder injection
function injection(file, str){
	var sidebar = file.substring(file.indexOf("#" + str) + 3 + str.length);
	var loc1 = sidebar.indexOf("#");
	document.getElementById("sidebar").innerHTML = sidebar.substring(0, loc1 - 2);
	var header = sidebar.substring(loc1 + 3)
	var loc2 = header.indexOf("#");
	document.getElementById("header").innerHTML = header.substring(0, loc2 - 2);
}

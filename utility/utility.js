window.onload = function(){
	var sidebartext = "if you see this javscript sucks";
	$.ajax({ url: "utility/mainSideBar.txt"})
		.done(function(file_content) {
			console.log("loaded");
			sidebartext = file_content;
		})
		.fail(function(){
			console.log("fail");
		});
	var sidebar = document.getElementById("sidebar");
	sidebar.innerHTML = sidebartext;
}
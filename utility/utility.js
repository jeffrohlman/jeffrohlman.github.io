window.onload = function(){
	var sidebartext = "if you see this javscript sucks";
	$.ajax({ url: "utility/mainSideBar.txt", success: function(file_content) {
		sidebartext = file_content;
	}});
	var sidebar = document.getElementById("sidebar");
	sidebar.innerHTML = sidebartext;
}
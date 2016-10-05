var submitData = function(){
	document.getElementById('title').innerHTML = "";
	document.getElementById('authors').innerHTML = "";
	document.getElementById('s1').innerHTML = "";
	document.getElementById('s2').innerHTML = "";
	document.getElementById('s3').innerHTML = "";
	document.getElementById('shortened').innerHTML = "";
	var urlBase = "https://gateway-a.watsonplatform.net/calls/url/URLGetCombinedData?";
	var apiKey = "2d8f171e2cc0b20e4d02e3df1ae755a1b94399df";
	urlBase = urlBase + "apikey=" + apiKey;
	var url = $("#site").val();
	urlBase = urlBase + "&url=" + url;
	urlBase = urlBase + "&extract=keywords,concepts,title,authors" + "&outputMode=json" + "&showSourceText=1";
	$.ajax({
		url: urlBase,
		type: 'POST',
		success: function(data){
			console.log(data);
			document.getElementById('title').innerHTML += data.title;
			if(data.authors.names.length > 1)
				document.getElementById('authors').innerHTML = "Authors: ";
			else
				document.getElementById('authors').innerHTML = "Author: ";
			for(var i = 0; i < data.authors.names.length; i++){
				if(i != 0)
					document.getElementById('authors').innerHTML += ", ";
				document.getElementById('authors').innerHTML += data.authors.names[i];
			}
			/*for(var i = 0; i < data.concepts.length; i++){
				if(i != 0)
					document.getElementById('concepts').innerHTML += ", ";
				document.getElementById('concepts').innerHTML += data.concepts[i].text + "(" + data.concepts[i].relevance + ")";
			}
			for(var i = 0; i < data.keywords.length; i++){
				if(i != 0)
					document.getElementById('keywords').innerHTML += ", ";
				document.getElementById('keywords').innerHTML += data.keywords[i].text + "(" + data.keywords[i].relevance + ")";
			}
			document.getElementById('text').innerHTML += data.text;*/

			var temp = {sents: "", scores: 0, rp: 0};
			var op = [];
			var pos = 0;
			var ps = 0;

			for(var i = 0; i < data.text.length; i++){
				if(data.text.charAt(i) == '\n' ){
					temp.sents = data.text.substring(pos, i);
					temp.rp = i;
					op[ps] = Object.assign({}, temp);
					pos = i + 1;
					ps++;
				}
			}
			for(var i = 0; i < op.length; i++){
				op[i].scores = 0;
				for(var j = 0; j < data.concepts.length; j++){
					if(op[i].sents.toLowerCase().includes(data.concepts[j].text.toLowerCase()))
						op[i].scores += parseFloat(data.concepts[j].relevance);
				}
				for(var j = 0; j < data.keywords.length; j++){
					if(op[i].sents.toLowerCase().includes(data.keywords[j].text.toLowerCase()))
						op[i].scores += parseFloat(data.keywords[j].relevance);
				}
				//console.log(op[i].scores);
			}
			op.sort(function(a, b){return b.scores - a.scores});
			if(op[0].rp > op[1].rp){
				temp = Object.assign({},op[0]);
				op[0] = Object.assign({}, op[1]);
				op[1] = Object.assign({}, temp);
			}
			if(op[0].rp > op[2].rp){
				temp = Object.assign({},op[0]);
				op[0] = Object.assign({}, op[2]);
				op[2] = Object.assign({}, temp);
			}
			if(op[1].rp > op[2].rp){
				temp = Object.assign({},op[1]);
				op[1] = Object.assign({}, op[2]);
				op[2] = Object.assign({}, temp);
			}
			document.getElementById('s1').innerHTML += op[0].sents;
			if(op.length > 1)
				document.getElementById('s2').innerHTML += op[1].sents;
			else
				document.getElementById('s2').innerHTML += "N/A";
			if(op.length > 2)
				document.getElementById('s3').innerHTML += op[2].sents;
			else
				document.getElementById('s3').innerHTML += "N/A";
			document.getElementById('shortened').innerHTML = "Article Shortened By: " + Math.round((100 - ((op[0].sents.length + op[1].sents.length + op[2].sents.length)/data.text.length * 100)) * 100) / 100 + "%";
		}
	});
}
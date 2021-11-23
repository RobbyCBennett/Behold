const init = function() {
	const injectElement = document.createElement('div');
	injectElement.className = "reminder-box";
	injectElement.style.width = "650px";
	injectElement.style.borderRadius = "36px";
	// injectElement.style.height = "600px";
	injectElement.style.backgroundColor = "#292a2d";
	injectElement.style.position = "fixed";
	injectElement.style.top = "50%";
	injectElement.style.left = "50%";
	injectElement.style.marginTop = "-325px";
	injectElement.style.marginLeft = "-325px";
	injectElement.style.zIndex = "5000";
	injectElement.style.textAlign = "center";
	injectElement.style.display = "flex";
	injectElement.style.flexDirection = "column";
	injectElement.style.alignItems = "center";
	injectElement.style.color = "#E8EAED";
	
	const msg = document.createElement('h3');
	msg.innerHTML = "Hey there busy bee... Are you still working?";
	msg.style.fontSize = "32px";
	msg.style.padding = "20px 80px";
	msg.style.margin = "30px 30px";

	const img = document.createElement('img');
	img.src = chrome.runtime.getURL('BeholdABee.png');
	img.style.width = "300px";
	// img.style.margin = "0 auto";
	
	
	const btn = document.createElement('button');
	btn.innerHTML = "YUP! STILL HERE";
	btn.className = "reminder-btn";
	btn.style.backgroundColor = "#ffd252";
	btn.style.fontSize = "18px";
	btn.style.padding = "20px";
	btn.style.width = "360px";
	btn.style.margin = "50px";
	btn.style.borderRadius = "12px";
	btn.style.color = "#292a2d";
	btn.style.cursor = "pointer";

	// btn.onclick = "closeReminder()";
	
	document.body.appendChild(injectElement);
	injectElement.appendChild(msg);
	injectElement.appendChild(img);
	injectElement.appendChild(btn);
	
	console.log("it works!")
}


init();


document.getElementsByClassName("reminder-btn").onclick = closeReminder();

const closeReminder = function() {
	document.getElementsByClassName("reminder-box").style.display = "none";
}



// How do i access the storage list of number of reminders
// Why wont the close option work
// font
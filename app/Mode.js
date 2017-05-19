window.addEventListener('DOMContentLoaded', checkme, false);
function switchmode()
	 {
		 localStorage.mode = ~localStorage.mode;
	 }
	function checkme()	
	{
		if(!document.getElementById("welcomebutton"))
		{
			document.getElementById("mode").style.display='block';
			document.getElementById("mode").addEventListener("click", switchmode);
		}			
			
	}
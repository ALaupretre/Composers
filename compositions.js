const list = document.querySelector(".list");
const works = JSON.parse(localStorage.works);

document.title = localStorage.name + " Works";
document.getElementById("composerValue").innerHTML = localStorage.fullName;
console.log(JSON.parse(localStorage.works));


works.forEach((work) => {
	const li = document.createElement("li");
	li.innerHTML = work.title;
	list.appendChild(li);

});
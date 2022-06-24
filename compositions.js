const lists = document.querySelectorAll(".list");
const dropBtns = document.querySelectorAll(".drop-btn");
const listChamber = document.querySelector(".chamber");
const listKeyboard = document.querySelector(".keyboard");
const listOrchestral = document.querySelector(".orchestral");
const listStage = document.querySelector(".stage");
const listVocal = document.querySelector(".vocal");
const works = JSON.parse(localStorage.works);

document.title = localStorage.name + " Works";
document.getElementById("composerValue").innerHTML = localStorage.fullName;
console.log(JSON.parse(localStorage.works));


works.forEach((work) => {
	const p = document.createElement("p");
	p.innerHTML = work.title + popRecIcons(work);
	sortGenre(work, p);

});

// Append work in list of corresponding genre
function sortGenre(object, child) {
	if (object.genre === "Chamber") {
		listChamber.appendChild(child);
	}
	if (object.genre === "Keyboard") {
		listKeyboard.appendChild(child);
	}
	if (object.genre === "Orchestral") {
		listOrchestral.appendChild(child);
	}
	if (object.genre === "Stage") {
		listStage.appendChild(child);
	}
	if (object.genre === "Vocal") {
		listVocal.appendChild(child);
	}
}

// Write icons if popular, recommended or both
function popRecIcons(object) {
	if (object.popular === "1" && object.recommended === "1") {
		return " <i class='las la-fire-alt'></i> <i class='lar la-star'></i>";
	} else if (object.popular === "1") {
		return " <i class='las la-fire-alt'></i>";
	} else if (object.recommended === "1") {
		return " <i class='lar la-star'></i>";
	} else
		return "";
}

lists.forEach((list) => {
	if (list.childNodes.length < 6) {
		list.remove();
	}
});

dropBtns.forEach(dropBtn => {
	dropBtn.addEventListener("click", () => {
		dropBtn.parentNode.classList.toggle("active");
	});
});

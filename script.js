const API_URL = "https://api.openopus.org/composer/list/search/.json";

const verticalLines = document.querySelectorAll(".vertical-line");
const compContainer = document.getElementById("composer-container");
const portrait = document.querySelector(".card-portrait");
const composer_count = 1;

const kebabCase = string => string.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase();

// Create color for each epoch
const colors = {
	"Medieval": "#fff100",
	"Renaissance": "#ff8c00",
	"Baroque": "#e81123",
	"Classical": "#ec008c",
	"Early Romantic": "#8f2ca8",
	"Romantic": "#0226d9",
	"Late Romantic": "#00bcf2",
	"20th Century": "#00b294",
	"Post-War": "#009e49",
	"21st Century": "#bad80a",
};

getComposers("./data/composers.json");

async function getComposers(url) {
	const res = await fetch(url);
	const data = await res.json();

	console.log(data.composers);

	showComposers(data.composers);
}


//Vertical lines

verticalLines.forEach((verticalLine) => {
	verticalLine.style.left = mapRangeX(verticalLine.innerHTML) + "%";
});



// Create a div for each composer
function showComposers(composers) {
	composers.forEach((composer) => {
		const name = composer.name;
		const birth = composer.birth;
		const death = composer.death;

		console.log(kebabCase);

		const birthYear = birth.slice(0, 4); // Get only year in the date
		const deathYear = (death == null) ? "" : death.slice(0, 4);


		birthYearValue = Number(birthYear);
		deathYearValue = Number(deathYear);
		// const lifeSpan = deathYearValue - birthYearValue;
		// console.log(lifeSpan);

		const composerStartX = mapRangeX(birthYearValue);
		const composerEndX = mapRangeX(deathYearValue);

		const composerY = composer.id * 93 / composers.length + 3; // Map range of ids to position in %

		const composerWidth = death ? composerEndX - composerStartX : 20;

		const epoch = composer.epoch;
		const color = colors[epoch]; // Get color from object

		const composerEl = document.createElement("div");
		composerEl.classList.add("composer");

		composerEl.setAttribute(
			"style", `
			background-color : ${color};
			left : calc(${composerStartX}% - 0px);
			width : ${composerWidth}%;
			top : ${composerY}%`
			// top : ${Math.random() * 90 + 5}%

		);

		composerEl.innerHTML = `
			<div class="name">
				<div>${name}</div>
			</div>
		`;

		compContainer.appendChild(composerEl);

		composerEl.addEventListener("mouseover", () => {
			composerEl.style.backgroundColor = "#FFF";
			// portrait.src = `../portraits/schubert.jpg`;
			// portrait.style.border = `3px solid red`;
		});

		composerEl.addEventListener("mouseout", () => {
			composerEl.style.backgroundColor = color;
		});
	});
};


// Map range of years to range of position in %
function mapRangeX(input) {
	// output = outMin + ((outMax - outMin) / (inMax - inMin)) * (input - inMin)
	return (0 + ((100 - 0) / (2022 - 1120)) * (input - 1120));
}


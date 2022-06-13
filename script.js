const API_URL = "https://api.openopus.org/composer/list/search/.json";
const WIKI_URL = "https://en.wikipedia.org/w/api.php?origin=*&";

const verticalLines = document.querySelectorAll(".vertical-line");
const compContainer = document.getElementById("composer-container");
const portrait = document.querySelector(".card-portrait");
const composerContainer = document.getElementById("composer-container");
const searchLabel = document.querySelector(".search");
const search = document.querySelector(".search-term");
const radios = document.querySelectorAll(".radio");
const allBox = document.getElementById("all");
const popularBox = document.getElementById("popular");
const recommendedBox = document.getElementById("recommended");




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


getComposers("./data/dump.json");

async function getComposers(url) {
	const res = await fetch(url);
	const data = await res.json();

	showComposers(data.composers);
}


// Position vertical lines
verticalLines.forEach((verticalLine) => {
	verticalLine.style.left = mapRangeX(verticalLine.innerHTML) + "%";
});


// Create a div for each composer

function showComposers(composers) {
	composers.forEach((composer, idx) => {
		const name = composer.name;
		const fullName = composer.complete_name;

		const birth = composer.birth;
		const death = composer.death;

		const birthYear = birth.slice(0, 4); // Get only year in the date
		const deathYear = (death == null) ? "" : death.slice(0, 4);

		const isPopular = composer.popular === "1";
		const isRecommended = composer.recommended === "1";

		birthYearValue = Number(birthYear);
		deathYearValue = Number(deathYear);
		// const lifeSpan = deathYearValue - birthYearValue;
		// console.log(lifeSpan);

		const composerStartX = mapRangeX(birthYearValue);
		const composerEndX = mapRangeX(deathYearValue);

		const composerY = idx * 93 / composers.length + 3; // Map range of idx to position in %

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

		radios.forEach(radio => radio.addEventListener("change", (e) => {
			if (allBox.checked) {
				composerEl.style.opacity = 1;
				composerEl.style.pointerEvents = "initial";
			}

			if (popularBox.checked) {
				if (isPopular) {
					composerEl.style.opacity = 1;
					composerEl.style.pointerEvents = "initial";
				} else {
					composerEl.style.opacity = .2;
					composerEl.style.pointerEvents = "none";
				}
			}

			if (recommendedBox.checked) {
				if (isRecommended) {
					composerEl.style.opacity = 1;
					composerEl.style.pointerEvents = "initial";
				} else {
					composerEl.style.opacity = .2;
					composerEl.style.pointerEvents = "none";
				}
			}
		}));



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

		composerEl.addEventListener("click", () => {
			closeCard();
			showCard(fullName, birthYear, deathYear, epoch, color, name, isPopular, isRecommended);
		});


		search.addEventListener("input", (e) => {
			matchCard(e.target.value);
			let matchCount = "|  " + document.querySelectorAll(".matching").length;
			searchLabel.setAttribute("data-value", matchCount);
		});

		// Add .matching to composerEl if searchTerm matched fullName
		function matchCard(searchTerm) {

			// Normalize fullName and check if includes searchTerm
			if (fullName
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "")
				.toLowerCase()
				.includes(searchTerm.toLowerCase())

				&& searchTerm.length > 1) {



				composerEl.classList.add("matching");
			} else {
				composerEl.classList.remove("matching");

			}

		}
	});
};


// Remove all accents,  remove "." and "," and replace " " with "-"
function toKebabCase(str) {
	const strKebab = str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[\s_]+/g, '-')
		.replace(/[.,\s]/g, '');
	return strKebab;
}



// function matchCard(searchTerm, fullName) {
// 	console.log(searchTerm);
// 	if (fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
// 		composerEl.classList.add("matching");
// 	} else {
// 		composerEl.classList.remove("matching");
// 	}
// }

function showCard(fullName, birth, death, epoch, color, name, isPopular, isRecommended) {
	closeCard();

	// Tag if popular/recommended
	const popular = isPopular ? `<span class="tag"><i class="fa-solid fa-fire-flame-curved fa-xs"></i> Popular</span>` : "";

	const recommended = isRecommended ? `<span class="tag"><i class="fa-solid fa-star fa-xs"></i> Recommended</span>` : "";


	const card = document.createElement("div");
	card.classList.add("card");

	fetch(`${WIKI_URL}action=query&list=search&srsearch=${fullName}%20composer&srlimit=1&utf8=&format=json`)
		.then(res => res.json())
		.then(data => {
			const pageId = data.query.search[0].pageid;
			console.log(pageId);

			fetch(`${WIKI_URL}format=json&action=query&prop=extracts&exsentences=3&explaintext&pageids=${pageId}`)
				.then(res => res.json())
				.then(data => {
					const wikiContent = data.query.pages[pageId].extract;
					console.log(wikiContent);


					card.innerHTML = `
					<div class="card-header">
								${popular}
								${recommended}
								<i class="fa-solid fa-xmark fa-xl close-btn"></i>
							</div>

							<div class="card-content">
								<div class="card-main">
									<img src="/portraits/${toKebabCase(name)}.jpg" alt="${fullName}" class="card-portrait">
									<h2 class="card-name">${fullName}</h2>
									<p class="card-birth-death">${birth} - ${death}</p>
									<p class="card-epoch" style="color:${color}">${epoch}</p>
								</div>

								<div class="card-secondary">
									<p class="card-wiki">${wikiContent} <a target="_blank"
											href="http://en.wikipedia.org/?curid=${pageId}">Learn more</a></p>
									<button class="show-compositions"><i class="fa-solid fa-list"></i> SHOW
										COMPOSITIONS</button>
								</div>
							</div>
					`;

					composerContainer.appendChild(card);

					// All close btn are needed in case many cards are opened
					document.querySelectorAll(".close-btn").forEach((btn) => {
						btn.addEventListener("click", () => closeCard()
						);
					});
				});
		});

	// console.log(pageId);
}


function closeCard() {
	const cards = document.querySelectorAll(".card");
	cards.forEach((card) => card.remove());
	// card.parentElement.removeChild(card);
}









// Map range of years to range of position in %
function mapRangeX(input) {
	// output = outMin + ((outMax - outMin) / (inMax - inMin)) * (input - inMin)
	return (0 + ((100 - 0) / (2022 - 1120)) * (input - 1120));
}


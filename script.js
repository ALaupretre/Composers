const API_URL = "https://api.openopus.org/composer/list/search/.json";
const WIKI_URL = "https://en.wikipedia.org/w/api.php?origin=*&";

const verticalLines = document.querySelectorAll(".vertical-line");
const compContainer = document.getElementById("composer-container");
const portrait = document.querySelector(".card-portrait");
const composerContainer = document.getElementById("composer-container");

const composer_count = 1;


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
    const fullName = composer.complete_name;
    const birth = composer.birth;
    const death = composer.death;

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

    composerEl.addEventListener("click", () => {
      showCard(fullName, birthYear, deathYear, epoch, color, name);
    });
  });
};

function showCard(fullName, birth, death, epoch, color, name) {


  fetch(`${WIKI_URL}action=query&list=search&srsearch=${fullName}%20composer&srlimit=1&utf8=&format=json`)
    .then(res => res.json())
    .then(data => {
      const pageId = data.query.search[0].pageid;

      fetch(`${WIKI_URL}format=json&action=query&prop=extracts&exsentences=3&explaintext&pageids=${pageId}`)
        .then(res => res.json())
        .then(data => {
          const wikiContent = data.query.pages[pageId].extract;



          const card = document.createElement("div");
          card.classList.add("card");
          card.innerHTML = `
					<div class="card-header">
								<span class="tag"><i class="fa-solid fa-fire-flame-curved fa-xs"></i> Popular</span>
								<span class="tag"><i class="fa-solid fa-star fa-xs"></i> Recommended</span>
								<i class="fa-solid fa-xmark fa-xl close-btn"></i>
							</div>

							<div class="card-content">
								<div class="card-main">
									<img src="/portraits/${name}.jpg" alt="${fullName}" class="card-portrait">
									<h2 class="card-name">${fullName}</h2>
									<p class="card-birth-death">${birth} - ${death}</p>
									<p class="card-epoch" style="color:${color}">${epoch}</p>
								</div>

								<div class="card-secondary">
									<p class="card-wiki">${wikiContent}<a target="_blank"
											href="http://en.wikipedia.org/?curid=${pageId}">Learn more</a></p>
									<button class="show-compositions"><i class="fa-solid fa-list"></i> SHOW
										COMPOSITIONS</button>
								</div>
							</div>
					`;
          composerContainer.appendChild(card);
          document.querySelector(".close-btn").addEventListener("click", (e) => {
            card.parentElement.removeChild(card);
          });
        });
    });
  // console.log(pageId);


}
function closeCard() {
  card.parentElement.removeChild(card);
}









// Map range of years to range of position in %
function mapRangeX(input) {
  // output = outMin + ((outMax - outMin) / (inMax - inMin)) * (input - inMin)
  return (0 + ((100 - 0) / (2022 - 1120)) * (input - 1120));
}


const popup_1 = document.getElementById("popup-1");
const openPowersButton_1 = document.getElementById("popup-open-1");
const closePowersButton_1 = document.getElementById("popup-close-1");

function openPopup() {
    popup_1.style.display = "block";
}

function closePopup() {
    popup_1.style.display = "none";
}

openPowersButton_1.addEventListener('click', openPopup);
closePowersButton_1.addEventListener('click', closePopup);

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closePopup();
  }
});

document.addEventListener('click', function (event) {
  if (!popup_1.contains(event.target) && event.target !== openPowersButton_1) {
    closePopup();
  }
});
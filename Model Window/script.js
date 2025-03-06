'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpneModel = document.querySelectorAll('.show-modal');
console.log(btnsOpneModel);

const closeModel = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
const openModel = function () {
    console.log('Button clicked');
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }

for (let i = 0; i < btnsOpneModel.length; i++) {
  btnsOpneModel[i].addEventListener('click', openModel);
}
btnCloseModal.addEventListener('click', closeModel);
overlay.addEventListener('click', closeModel);
document.addEventListener('keydown', function (e) {
    if(e.key==='Escape' && !modal.classList.contains('hidden')){
        closeModel();
    }
});

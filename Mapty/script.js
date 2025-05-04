'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }
  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }
  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
const run1 = new Running([39, -12], 5.2, 24, 178);
const cycling = new Cycling([92, -12], 53.2, 624, 218);
// console.log(run1, cycling);
// let map, mapEvent;
class App {
  #map;
  #mapEvent;
  #workouts = [];
  Workout;
  workoutToPush;
  workoutToEdit;
  constructor() {
    // Get user position
    this._getPosition();
    this._toggleElevationField();

    // Get data from local storage
    // this._getLocalStorage();

    // Attach event handlers
    form.addEventListener('submit', this._newWorkOut.bind(this));
    inputType.addEventListener('change', this._toggleElevationField());
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));

    // Add event delegation for edit and delete buttons
    containerWorkouts.addEventListener(
      'click',
      this._handleWorkoutActions.bind(this)
    );
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Location Not Found');
        }
      );
    }
  }
  _loadMap(pos) {
    // console.log(pos);
    // console.log(this);
    const { latitude } = pos.coords;
    const { longitude } = pos.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.#map);
    const marker = L.marker(coords).addTo(this.#map);

    marker.bindPopup('<b>Hello world!</b><br>I Live Here.').openPopup();

    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this.renderWorkoutMarker(work);
    });
  }
  _showForm(mapE) {
    // console.log(mapE);
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _hideForm() {
    // Empty inputs
    inputDistance.value =
      inputDuration.value =
      inputElevation.value =
      inputCadence.value =
        '';
    // form.style.display = 'none';
    form.classList.add('hidden');
    // setTimeout(() => (form.style.display = 'grid'), 1000);
  }
  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkOut(formE) {
    formE.preventDefault();
    const inputs = (...inputs) => inputs.every(input => Number.isFinite(input));
    const allPositive = (...inputs) => inputs.every(input => input > 0);

    // Get data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    // If we're editing an existing workout
    if (this.workoutToEdit) {
      // Update the existing workout
      this.workoutToEdit.type = type;
      this.workoutToEdit.distance = distance;
      this.workoutToEdit.duration = duration;

      if (type === 'running') {
        const cadence = +inputCadence.value;
        if (
          !inputs(distance, duration, cadence) ||
          !allPositive(distance, duration, cadence)
        ) {
          return alert('Input has to be a positive number!');
        }
        this.workoutToEdit.cadence = cadence;
        this.workoutToEdit.calcPace();
      }

      if (type === 'cycling') {
        const elevation = +inputElevation.value;
        if (
          !inputs(distance, duration, elevation) ||
          !allPositive(distance, duration)
        ) {
          return alert('Input has to be a positive number!');
        }
        this.workoutToEdit.elevationGain = elevation;
        this.workoutToEdit.calcSpeed();
      }

      // Update description
      this.workoutToEdit._setDescription();

      // Update local storage
      this._setLocalStorage();

      // Refresh the workout list
      this._refreshWorkoutsList();

      // Clear the workout being edited
      this.workoutToEdit = null;

      // Hide the form
      this._hideForm();

      return;
    }

    // Creating a new workout (existing code)
    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (
        !inputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert('Input has to be a positive number!');
      }
      this.Workout = new Running(
        this.#mapEvent.latlng,
        distance,
        duration,
        cadence
      );
    }
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !inputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert('Input has to be a positive number!');
      }
      this.Workout = new Cycling(
        this.#mapEvent.latlng,
        distance,
        duration,
        elevation
      );
    }

    // Add to workouts array
    this.#workouts.push(this.Workout);

    // Render workout on map
    this.renderWorkoutMarker(this.Workout);

    // Render workout in list
    this._renderWorkoutsList(this.Workout);

    // Hide form
    this._hideForm();

    // Set local storage
    this._setLocalStorage();
  }
  renderWorkoutMarker(workout) {
    // console.log(toString(this.Workout.distance));
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }
  _renderWorkoutsList(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <div class="workout__actions">
            <button class="btn-icon btn-icon--edit">
              <svg class="btn-icon__svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button class="btn-icon btn-icon--delete">
              <svg class="btn-icon__svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
    `;
    if (workout.type === 'running') {
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;
    }
    if (workout.type === 'cycling') {
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;
    }
    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    // console.log(workoutEl);
    if (!workoutEl) return;
    // console.log(this.#workouts);
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    console.log(workout);
    this.#map.setView(workout.coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
    // workout.click();
  }
  _setLocalStorage() {
    console.log(this.#workouts);
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;
    console.log(data);
    this.#workouts = data;
    this.#workouts.forEach(work => {
      // console.log(work);
      this._renderWorkoutsList(work);
    });
  }
  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
  _handleWorkoutActions(e) {
    const workoutEl = e.target.closest('.workout');
    console.log(workoutEl);
    if (!workoutEl) return;

    const workoutId = workoutEl.dataset.id;
    const workout = this.#workouts.find(work => work.id === workoutId);

    // Handle edit button click
    if (e.target.closest('.btn-icon--edit')) {
      console.log(e.target.closest('.btn-icon--edit'));
      this._editWorkout(workout, workoutEl);
    }

    // Handle delete button click
    if (e.target.closest('.btn-icon--delete')) {
      this._deleteWorkout(workout, workoutEl);
    }
  }

  _editWorkout(workout, workoutEl) {
    // Show the form
    form.classList.remove('hidden');

    // Set form values to current workout values
    inputType.value = workout.type;
    inputDistance.value = workout.distance;
    inputDuration.value = workout.duration;

    // Toggle elevation/cadence fields based on workout type
    this._toggleElevationField();

    if (workout.type === 'running') {
      inputCadence.value = workout.cadence;
    } else if (workout.type === 'cycling') {
      inputElevation.value = workout.elevationGain;
    }

    // Store the workout being edited
    this.workoutToEdit = workout;

    // Focus on the distance input
    inputDistance.focus();
  }

  _deleteWorkout(workout, workoutEl) {
    // Remove from DOM
    workoutEl.remove();

    // Remove from workouts array
    const index = this.#workouts.findIndex(work => work.id === workout.id);
    this.#workouts.splice(index, 1);

    // Update local storage
    this._setLocalStorage();

    // Remove marker from map
    this._removeWorkoutMarker(workout);
  }

  _removeWorkoutMarker(workout) {
    // Find and remove the marker for this workout
    this.#map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        const popupContent = layer.getPopup().getContent();
        if (popupContent.includes(workout.description)) {
          this.#map.removeLayer(layer);
        }
      }
    });
  }

  _refreshWorkoutsList() {
    // Clear the workouts list
    const workoutElements = document.querySelectorAll('.workout');
    workoutElements.forEach(el => el.remove());

    // Re-render all workouts
    this.#workouts.forEach(workout => {
      this._renderWorkoutsList(workout);
    });
  }
}

const Application = new App();

const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-button");
const profileContainer = document.querySelector(".profile-container");
const errorContainer = document.querySelector(".error-message"); // Changed from error-container to .error-message
const avatar = document.querySelector(".profile-avatar");
const nameElement = document.querySelector(".profile-name");
const usernameElement = document.querySelector(".profile-username");
const bioElement = document.querySelector(".profile-bio");
const locationElement = document.querySelector(".profile-location");
const joinedDateElement = document.querySelector(".profile-joined-date");
const profileLink = document.querySelector(".profile-link-btn");
const followers = document.querySelector(".stat-followers");
const following = document.querySelector(".stat-friends"); // Note: HTML class is .stat-friends
const repos = document.querySelector(".stat-repos");
const companyElement = document.querySelector(".profile-company");
const blogElement = document.querySelector(".profile-blog");
const twitterElement = document.querySelector(".profile-twitter");
const loadingRepos = document.querySelector(".loading-repos");
const companyContainer = document.querySelector(".info-item.company"); // Targets the div with both classes
const blogContainer = document.querySelector(".info-item.blog"); // Targets the div with both classes
const twitterContainer = document.querySelector(".info-item.twitter"); // Targets the div with both classes
const reposContainer = document.querySelector(".repos-container");
const noReposMessage = document.querySelector(".no-repos-message");

function getUserName() {
  return searchInput.value.trim();
}
function validateUserName(userName) {
  if (userName === "") {
    alert("Please enter a username.");
    return false;
  }
  return true;
}
function setAvatar(URL) {
  avatar.src = URL.avatar_url;
}
function setName(URL) {
  nameElement.textContent = URL.name;
}
function setUsername(URL) {
  usernameElement.textContent = URL.login;
}
function setBio(URL) {
  if (URL.bio) {
    bioElement.textContent = URL.bio;
  } else {
    bioElement.textContent = "No bio available";
  }
}
function setLocation(URL) {
  if (URL.location) {
    locationElement.textContent = URL.location;
  } else {
    locationElement.textContent = "No location available";
  }
}
function setJoinedDate(URL) {
  const date = new Date(URL.created_at);
  joinedDateElement.textContent = `Joined ${date.toLocaleDateString()}`;
}
function setProfileLink(URL) {
  profileLink.href = URL.html_url;
  profileLink.textContent = "View Profile";
}
function setFollowers(URL) {
  followers.textContent = URL.followers;
}
function setFollowing(URL) {
  following.textContent = URL.following;
}
function setRepos(URL) {
  repos.textContent = URL.public_repos;
}
function setCompany(URL) {
  if (URL.company) {
    companyElement.textContent = URL.company;
  } else {
    companyElement.textContent = "No company";
  }
}
function setBlog(URL) {
  if (URL.blog) {
    blogElement.textContent = URL.blog;
    blogElement.href = URL.blog.startsWith("http")
      ? URL.blog
      : `https://${URL.blog}`;
  } else {
    blogElement.textContent = "No blog";
    blogElement.href = "#";
  }
}
function setTwitter(URL) {
  if (URL.twitter_username) {
    twitterElement.textContent = URL.twitter_username;
    twitterElement.href = `https://twitter.com/${URL.twitter_username}`;
  } else {
    twitterElement.textContent = "No Twitter account";
    twitterElement.href = "#";
  }
}
function showError(message) {
  // Hide the profile container and show the error message
  errorContainer.classList.remove("hidden");
  profileContainer.classList.add("hidden");
  errorContainer.textContent = message;
}
function renderRepos(repo) {
  const html = `
    <div class="repo-item">
              <a class="repo-name" href="${repo.html_url}" target="_blank">
                <i class="fas fa-code-branch"></i>
                 ${repo.name}
              </a>
              <p class="repo-description">${repo.description}</p>
              <div class="repo-stats">
                <span class="repo-language">
                  <i class="fas fa-circle"></i> ${
                    repo.language || "Not Specified"
                  }
                </span>
                <span class="repo-stars"> <i class="fas fa-star"></i> 0 </span>
                <span class="repo-forks">
                  <i class="fas fa-code-branch"></i> ${repo.forks_count || 0}
                </span>
                <span class="repo-updated">
                   <i class="fas fa-clock"></i> ${new Date(
                     repo.updated_at
                   ).toLocaleDateString()}
                </span>
              </div>
            </div>
            `;
  return html;
}
async function fetchProfile(username) {
  const url = `https://api.github.com/users/${username}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("User not found");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    showError(error.message);
    return null; // Return null if an error occurs
  }
}
async function fetchRepos(username) {
  const url = `https://api.github.com/users/${username}/repos?sort=created&per_page=5`;
  try {
    loadingRepos.classList.remove("hidden");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }
    const reposData = await response.json();
    return reposData;
  } catch (error) {
    showError(error.message);
  } finally {
    loadingRepos.classList.add("hidden");
  }
}
function clearProfile() {
  avatar.src = "";
  nameElement.textContent = "";
  usernameElement.textContent = "";
  bioElement.textContent = "";
  locationElement.textContent = "";
  joinedDateElement.textContent = "";
  profileLink.href = "";
  profileLink.textContent = "";
  followers.textContent = "";
  following.textContent = "";
  repos.textContent = "";
  companyElement.textContent = "";
  blogElement.textContent = "";
  blogElement.href = "";
  twitterElement.textContent = "";
  twitterElement.href = "";

  errorContainer.classList.add("hidden");
  profileContainer.classList.add("hidden");
  reposContainer.innerHTML = ""; // Clear previous repos
  loadingRepos.classList.add("hidden");
  noReposMessage.classList.add("hidden");
}

function renderProfile(data) {
  clearProfile();

  setAvatar(data);
  setName(data);
  setUsername(data);
  setBio(data);
  setLocation(data);
  setJoinedDate(data);
  setProfileLink(data);
  setFollowers(data);
  setFollowing(data);
  setRepos(data);
  setCompany(data);
  setBlog(data);
  setTwitter(data);

  loadingRepos.classList.add("hidden");
  profileContainer.classList.remove("hidden");
}
async function renderProfileAndRepos() {
  const userName = getUserName();
  if (!validateUserName(userName)) {
    return;
  }

  const profile = await fetchProfile(userName);
  if (!profile) {
    return; // If profile is not found, exit the function
  }
  renderProfile(profile);

  const repos = await fetchRepos(userName);
  if (!repos || repos.length === 0) {
    noReposMessage.classList.remove("hidden");
    return; // If no repos are found, exit the function
  }
  console.log(repos);
  reposContainer.innerHTML = ""; // Clear previous repos
  repos.forEach((repo) => {
    const repoHTML = renderRepos(repo);
    reposContainer.insertAdjacentHTML("beforeend", repoHTML);
  });

  //   fetchRepos(userName);
}

searchBtn.addEventListener("click", renderProfileAndRepos);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    renderProfileAndRepos();
  }
});

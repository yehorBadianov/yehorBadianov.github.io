setInfoProfile();

async function getUser() {
  try {
    displayLoader();
    const respons = await fetch('https://api.github.com/users/yehorBadianov');
    const data = await respons.json();
    hideLoader();

    return data;
  } catch (error) {
    return `Error ${error}`;
  }
}

async function getRepo() {
  try {
    displayLoader();
    const respons = await fetch('https://api.github.com/users/yehorBadianov/repos');
    const data = await respons.json();
    hideLoader();
  
    return data;
  } catch (error) {
    return `Error ${error}`;
  }
}

//запрос на дату репо
async function getLastCommit() {
  try {
    displayLoader();
    const response = await fetch('https://api.github.com/repos/yehorBadianov/yehorBadianov.github.io/commits/main');
    const data = await response.json();
    hideLoader();

    return data;
  } catch (error) {
    return `Error ${error}`;
  }
}

function setOverviewContent() {
  const userData = getUser();

  const contentOverviewBlock = document.querySelector('.content-overview');
  contentOverviewBlock.classList.add('content-list-overview-display');

  const pOverview = document.createElement('p');
  pOverview.classList.add('overview-text-date');

  const infoDiv = document.createElement('div');
  const infoDivText = document.createElement('p');

  // add user name
  userData.then(name => {
    infoDivText.textContent = `Hello everyone! My name is ${name.name} :)`;
  });

  infoDiv.classList.add('info-Div');
  infoDiv.appendChild(infoDivText);
  contentOverviewBlock.appendChild(infoDiv);

// date of gitHub created
  userData.then(data => {
    const handleAccCreatedDate = handleDateFromPromis(data.created_at);

    pOverview.innerHTML = `Account created: ${handleAccCreatedDate}`;
    contentOverviewBlock.appendChild(pOverview);
  });
}

function handleDateFromPromis(date) {
  return date.slice(0, 10).split('-').reverse().join('/');
}

function setInfoProfile() {
  const userData = getUser();

  const avatarDiv = document.querySelector('.content-img');
  const profileImg = document.createElement('img');
  profileImg.classList.add('profile-img');

  const nameTag = document.createElement('p');
  nameTag.classList.add('user-name-style');

  //add name and photo
  userData.then(data => {
    const userPhoto = data.avatar_url;
    profileImg.src = userPhoto;
    avatarDiv.appendChild(profileImg);

    const userNameLogin = data.login;
    nameTag.innerHTML = userNameLogin;
    avatarDiv.append(nameTag);
  });

  return userData;
}

function setRepoName() {
  const userData = getRepo();

  const contentListBlock = document.querySelector('.content-list');
  contentListBlock.classList.add('content-list-display');

  const repoList = document.querySelector('.content-list-ul');

  userData.then(data => {
    data.map(element => {
      let li = document.createElement('li');
      li.classList.add('list-item');

      li.innerHTML = element.name;
      repoList.appendChild(li);

      // last commit date
      li.addEventListener('click', () => {
        const commit = getLastCommit();
        commit.then(commitData => {
          const commitDate = handleDateFromPromis(commitData.commit.author.date);

          const span = document.createElement('span');
          span.classList.add('commit-date-style');

          span.textContent = commitDate;

          li = li.textContent.includes(span.textContent) ? '' : li.appendChild(span);
        });
      });
    });
  });

  return userData;
}

function addEventsForNavContent() {
  setRepoName();
  setOverviewContent();

  const contentListBlock = document.querySelector('.content-list');
  const showRepoBtn = document.querySelector('.repo');
  const showOverviewBtn = document.querySelector('.overview');

  const contentOverviewBlock = document.querySelector('.content-overview');

  showRepoBtn.addEventListener('click', () => {
    showContentFromNav(contentListBlock, showRepoBtn, 'content-list-display');
    checkIfBlockIsShown(contentListBlock, contentOverviewBlock, showRepoBtn, showOverviewBtn);
  });

  showOverviewBtn.addEventListener('click', () => {
    showContentFromNav(contentOverviewBlock, showOverviewBtn, 'content-list-overview-display');
    checkIfBlockIsShown(contentOverviewBlock, contentListBlock, showOverviewBtn, showRepoBtn);
  });
}

addEventsForNavContent();

function showContentFromNav(contentElement, linkElement, cssClass) {
  event.preventDefault();

  contentElement.classList.remove(`${cssClass}`);

  contentElement.style.display = (contentElement.style.display === 'block') ? 'none' : 'block';

  if (contentElement.style.display === 'block') {
    linkElement.style.borderBottom = '1px solid #EC775C';
  } else  linkElement.style.borderBottom = 'none';
}

function checkIfBlockIsShown(repoBlock, overviewBlick, repoBtn, overviewBtn) {

  if (repoBlock.style.display === 'block') {
    overviewBlick.style.display = 'none';
    repoBtn.style.borderBottom = '2px solid #EC775C';
    overviewBtn.style.borderBottom = 'none';
  } else if (overviewBlick.style.display === 'block') {
    repoBlock.style.display = 'none';
    overviewBtn.style.borderBottom = '2px solid red';
    repoBtn.style.borderBottom = 'none';
  }
}

function displayLoader() {
  const loader = document.querySelector('.loader');
  loader.style.display = "block";

}

function hideLoader() {
  const loader = document.querySelector('.loader')
  setTimeout(() => {
    loader.style.display = "none";
  }, 1000)
  
}

//дублікація коду можна закинути в одну функції(але шо робити з урлой)

// Що зробити
// 1. Обработать дату останнього коміта
// 2. Добавить ще якусь інфу в овервью +
// 3. Доробить стіля(футер. оформить всю інфу з запросів) + зробить якийсь хедер +хедер
// 4. Зробити лоадер

async function getDataFromGitHub() {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/vnd.github+json");
  myHeaders.append("Authorization", "Bearer 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");

  //обробити помилку
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch("https://api.github.com/search/repositories?q=user:yehorBadianov", requestOptions);
  const data = await response.json();
  
  return data;
}

// Отримую дані про юзера з гіта, можна буде цим промісом переписати фото та ім'я
async function getPersonalUserDataFromGitHub() {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/vnd.github+json");
  myHeaders.append("Authorization", "Bearer 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");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch("https://api.github.com/users/yehorBadianov", requestOptions);
  const data = await response.json();
  
  return data;
}

//запрос на дату репо
async function getLastCommit() {
  const response = await fetch('https://api.github.com/repos/yehorBadianov/yehorBadianov.github.io/commits/main');
  const data = await response.json();
  return data;
}


function setOverviewContent() {
  const userData = getPersonalUserDataFromGitHub();
  console.log('Overview', userData)

  const contentOverviewBlock = document.querySelector('.content-overview');
  // class - content-list-overview-display - none
  contentOverviewBlock.classList.add('content-list-overview-display');
  const pOverview = document.createElement('p');
  pOverview.classList.add('overview-text-date');

  //Тест створення елементів
  const testDiv = document.createElement('div');
  const testP = document.createElement('p');
  // стилі до імені всередині блоку
  userData.then(name => {
    testP.textContent = `Hello everyone! My name is ${name.name} :)`;
  });
  testDiv.classList.add('test-div');
  testDiv.appendChild(testP);
  contentOverviewBlock.appendChild(testDiv);

  // додати стилі для p а також додати ще якусь інфу
//ВИВОЖУ ДАТУ СТВОРЕННЯ В ОВЕРВЬЮ
  userData.then(data => {
    const handleAccCreatedDate = handleDate(data.created_at);
    pOverview.innerHTML = `Account created: ${handleAccCreatedDate}`;
    contentOverviewBlock.appendChild(pOverview);
  });

}

function handleDate(date) {
  const handleDate = date.slice(0, 10).split('-').reverse().join('/');

  return handleDate;
}


// PROFILE PHOTO and need to add name
function setInfoProfile() {
  const userData = getDataFromGitHub();
  console.log(userData)

  const avatarDiv = document.querySelector('.content-img');
  const profileImg = document.createElement('img');
  const nameTag = document.createElement('p');
  nameTag.classList.add('user-name-style');
  //зробити стиля для імені
  profileImg.classList.add('profile-img');

  //ДОДАЮ ІМ'Я
  userData.then(data => {
    profileImg.src = data.items[0].owner.avatar_url;
    avatarDiv.appendChild(profileImg);

    nameTag.innerHTML = data.items[0].owner.login;
    avatarDiv.append(nameTag);

  });

  return userData;
}

// РЕПОЗИТОРІЇ
function setRepoName() {
  const userData = setInfoProfile();

  const contentListBlock = document.querySelector('.content-list');
  const repoList = document.querySelector('.content-list-ul');

  contentListBlock.classList.add('content-list-display');

  //додати щоб лі були лінками
  // reposetory
  userData.then(data => {
    data.items.map(element => {
      const li = document.createElement('li');

      li.classList.add('list-item');
      li.innerHTML = element.name;
      repoList.appendChild(li);

      // add last commit date
      // ДОБАВИТЬ НАЗВУ КОМІТА ХЕШ І ДЕНЬ ЯК В ГІТ ХАБІ
      li.addEventListener('click', () => {
        const commit = getLastCommit();
        commit.then(commitData => {
          const commitDate = handleDate(commitData.commit.author.date);

          const span = document.createElement('span');
          span.classList.add('commit-date-style');
          span.textContent = commitDate;

          li.appendChild(span);
          // li.textContent += li.textContent.includes(commitDate) ? '' : commitDate;
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

// function showOverview() {
//   const contentListBlock = document.querySelector('.content-list');
//   const showOverviewBtn = document.querySelector('.overview');

//   showOverviewBtn.addEventListener('click', (e) => {
//     e.preventDefault();

//   });
// }

// showOverview();
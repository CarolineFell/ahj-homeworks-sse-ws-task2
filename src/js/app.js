import User from './User';
import Messanger from './Messanger';

const user = new User('https://ahj-homeworks-sse-ws-server2.herokuapp.com/users');

const enterNickname = document.querySelector('.enter-nickname');
const submit = document.querySelector('#submit');
const wrongName = document.querySelector('.wrong-name');
const noName = document.querySelector('.no-name');
let username = '';

function conectChat() {
  const messanger = new Messanger(username);
  messanger.init();
}

submit.addEventListener('click', async () => {
  const inputNickname = document.querySelector('#input-nickname');
  username = inputNickname.value;

  if (username) {
    const response = await user.load();
    const arrUsers = await response.json();

    if (arrUsers.findIndex((item) => item.name === username) === -1) {
      await user.add({ name: username });
      enterNickname.classList.add('hidden');

      inputNickname.value = '';
      conectChat();
      return;
    }
    wrongName.classList.remove('hidden');
    inputNickname.classList.add('invalid');

    if (inputNickname.addEventListener('input', () => {
      wrongName.classList.add('hidden');
      inputNickname.classList.remove('invalid');
    }));
  }

  if (!username) {
    noName.classList.remove('hidden');
    inputNickname.classList.add('invalid');

    if (inputNickname.addEventListener('input', () => {
      noName.classList.add('hidden');
      inputNickname.classList.remove('invalid');
    }));
  }
});
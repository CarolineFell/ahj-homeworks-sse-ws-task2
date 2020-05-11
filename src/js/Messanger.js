/* eslint-disable no-console */
import User from './User';

const user = new User('https://ahj-homeworks-sse-ws-server2.herokuapp.com/users');


function addNullToDate(value) {
  const newValue = value < 10 ? `0${value}` : value;
  return newValue;
}

function printData(valueDate) {
  const newDate = new Date(valueDate);
  const date = addNullToDate(newDate.getDate());
  const month = addNullToDate(newDate.getMonth() + 1);
  const year = addNullToDate(newDate.getFullYear());
  const hours = addNullToDate(newDate.getHours());
  const minutes = addNullToDate(newDate.getMinutes());
  const seconds = addNullToDate(newDate.getSeconds());
  const messageDate = `${hours}:${minutes}:${seconds} ${date}.${month}.${year}`;
  return messageDate;
}

export default class Messanger {
  constructor(name) {
    this.nameUser = name;
    this.url = 'wss://ahj-homeworks-sse-ws-server2.herokuapp.com/ws';
  }

  init() {
    this.messanger = document.querySelector('.messanger');
    this.inputMessage = document.querySelector('#input-message');
    this.messagesList = document.querySelector('#messages-list');

    this.messanger.classList.remove('hidden');
    this.initWebSocket();
    this.printUsers();

    window.addEventListener('beforeunload', () => {
      this.ws.close(1000, 'work end');
      user.remove(this.nameUser);
      this.printUsers();
    });

    this.inputMessage.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage(this.inputMessage.value);
        this.inputMessage.value = '';
      }
    });
  }

  initWebSocket() {
    this.ws = new WebSocket(this.url);

    this.ws.addEventListener('open', () => {
      console.log('connected to server');
    });

    this.ws.addEventListener('message', (e) => {
      this.printMessage(e);
    });

    this.ws.addEventListener('close', (e) => {
      console.log('server closed', e);
    });

    this.ws.addEventListener('error', () => {
      console.log('error on server');
    });
  }

  async printUsers() {
    const response = await user.load();
    const arrayUsers = await response.json();
    const contacts = document.querySelector('#contacts');
    contacts.innerHTML = '';

    for (const contact of arrayUsers) {
      const contactUser = document.createElement('div');
      contactUser.className = 'contact-user';
      contactUser.innerHTML = `
      <div class="contact-user-image ${contact.name === this.nameUser ? 'active' : ''}"></div>
      <div class="contact-user-name ${contact.name === this.nameUser ? 'active' : ''}">${contact.name}</div>
      `;
      contacts.appendChild(contactUser);
    }
  }

  printMessage(message) {
    const { type } = JSON.parse(message.data);

    if (type === 'message') {
      const { name, msg, dateTime } = JSON.parse(message.data);

      const itemMessage = document.createElement('li');
      itemMessage.className = `
        message
        ${this.nameUser === name ? 'active' : ''}
      `;

      itemMessage.innerHTML = `
      <div class="message-name-date">
        <span>${name}</span>
        <span>${printData(dateTime)}</span>
      </div>
      <div class="message">
      ${msg}
      </div>
      `;

      this.messagesList.appendChild(itemMessage);
      this.messagesList.scrollTo(0, itemMessage.offsetTop);
    } else if (type === 'add user') {
      this.printUsers();
    } else if (type === 'del user') {
      console.log('del user!!!');
      this.printUsers();
    }
  }

  sendMessage(message) {
    if (this.ws.readyState === WebSocket.OPEN) {
      try {
        const msg = {
          type: 'message',
          name: this.nameUser,
          msg: message,
          dateTime: new Date(),
        };
        const jsonMsg = JSON.stringify(msg);
        this.ws.send(jsonMsg);
      } catch (e) {
        console.log('err');
        console.log(e);
      }
    } else {
      console.log('reconect');
      this.ws = new WebSocket(this.url);
    }
  }
}
import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';
import { writable } from 'svelte/store';

// Database
export const db = GUN({ peers: ['https://gunjs.herokuapp.com/gun', 'http://gun-manhattan.herokuapp.com/gun'] });

// Gun User
export const user = db.user().recall({ sessionStorage: true });

// Current User's username
export const username = writable('');

// User state
export const userPassphrase = writable('');

// Received Images
export const receivedScreenshots = writable([]);

// Seleted Image to send
export const selectedScreenshot = writable('');

// Selected Contact to send Screenshot to
export const selectedContact = writable('');

// Sender: Cryptographically secure public/private key pair
export const senderKeyPairs = writable({});

// Receiver: Cryptographically secure public key pair
export const receiverKeyPairs = writable({});
  
user.get('alias').on(v => username.set(v))

db.on('auth', async (event) => {
  const alias = await user.get('alias'); // username string
  username.set(alias.toString());

  console.log(`signed in as ${alias}`);
});
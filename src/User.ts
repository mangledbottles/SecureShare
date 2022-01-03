import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';
import { writable } from 'svelte/store';

// Database
export const db = GUN();

// Gun User
export const user = db.user().recall({ sessionStorage: true });

// User Data
export const userData = writable({});

user.get('alias').once(alias => {
  userData.set({ alias });
});
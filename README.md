# Quark

#### Video Demo: [https://youtu.be/V_cHYTRkuYU](https://youtu.be/V_cHYTRkuYU)

## What is Quark?

Quark is a messaging service that uses post-quantum end-to-end encryption. Specifically, CRYSTALS-KYBER NIST PQC Round 3 Submissions. I used [crystals-kyber-javascript](https://github.com/antontutoveanu/crystals-kyber-javascript).

### Backend Working

When an account is created, a public key and a secret key are assigned to the user. The secret is encrypted using the user's password. The encrypted secret key and the public key are stored in MySQL. Whenever a user, let’s say Alice, messages another user, let’s say Bob, for the first time, a symmetric key and it’s encapsulation are created using Bob’s public key, which is stored in the table "friends". When Bob reads the message for the first time, the same symmetric key is generated using Bob's secret key, and the encapsulation. The symmetric key is then encrypted and stored, and the encapsulation is deleted. When registering, there are checks to make sure that the inputted password is strong. The password entered by the user is hashed and stored in the MySQL table "users" along with the keys. When the user logs in, the secret key is decrypted and stored in session data for easy access.

### Frontend Features

The UI/UX is thoughtfully designed. Some features, in no particular order:

- Show password button: It shows the inputted password when hovered and toggles show/hide when clicked
- The app has a dark theme but uses CSS variables to easily create light or other themes in the future.
- React router is used in the app so that when navigating between pages, the webpage doesn't reload.
- When messaging, new lines are possible by pressing shift+enter. When the enter key is pressed, the message is sent, and the text input clears. New lines are rendered as expected.
- The time at which the message is sent is shown with every message. The date is shown at the top of the messages from that date.

## Tech Stack

- node js
- react js
- express js
- crystals-kyber
- MySQL

## Structure

- [app](./app/) contains the frontend react app
- [backend](./backend/) contains a build of the frontend app and the backend node.js app
- custom [scripts](./backend/package.json) to test the project

## TODO LIST

I am still adding additional features!

- [ ] Responsive UI
- [x] Search through chats
- [ ] Ability to star messages
- [ ] Customizations
  - [ ] chat colors
  - [ ] chat backgrounds
- [ ] Profile Pictures
- [ ] Ability to change the username

## NOTES

- I am just a student and not experienced in cryptography. I have used information provided on the internet to make sure the app is as secure as possible. It is very likely that there are some security flaws in the app. In that case, feel free to contact me via [email](mailto:anshuman.garg1303@gmail.com)
- I know that the secret used for sessions isn't supposed to be visible to the public, but I don't plan on hosting this application. If you do host it, make sure to change it inside in backend/.env
- The config is configured with local testing in mind

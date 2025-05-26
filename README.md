# Welcome to InfoEvents_OlympicsTicketing, a ReactNAtive-Expo app'

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

Clone this repo :

On your local setup, in the project folder, open a terminal (gitbash advised) and do :
git init

Then : 
1. Install the needed dependencies

   ```in your terminal: 

   npm install
   ```

2. Start the app

   ```in your terminal : 
    npx expo start
   ```

In the terminal output, you'll find options to open.

Web local version starts on http://localhost:8081 : the backend must be running for the app to do its things. 

Use expoGo to start the mobile version. A legacy version is needed as Expo upgraded its expo go sdk mid-dev. 

This project uses [file-based routing](https://docs.expo.dev/router/introduction).

Test (staging) version is deployed on netlify here: https://test--infoeventolympics.netlify.app/ ;

Prod (master) version is deployed on netlify here:  https://infoeventolympics.netlify.app/ ;

-Mobile version : 
Two options : 1/ use the .apk file (your should have the link...)
2/ use ExpoGo. All expected mobile features should work (at least they did on my side). Please use a legacy version as expo upgrades its sdks just a few days before the deadline and stability was prioritized over immediate upgrade. 

Attention : this mobile app is Android Only. iOS hasn't been tested nor taken into account during dev. 

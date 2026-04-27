# Totally Not Anime Malware

Small Electron desktop app that displays a goofy anime GIF, rotates title text from local metadata, and uses a custom frameless window with drag, minimize, and close controls.

This project was developed by ezekieltem.

[<img src="./README%20Assets/x-icon.png" alt="[x.com](https://x.com/ezekieltem_rbx)" width="30">](https://x.com/ezekieltem_rbx)[<img src="./README Assets/youtube-icon.png" alt="[youtube.com](https://x.com/ezekieltem_rbx)" width="30">](https://www.youtube.com/@ezekieltem)[<img src="./README Assets/github-icon.png" alt="[github.com](https://github.com/ezekieltem/Goofy-Anime-Thing)" width="30">](https://github.com/ezekieltem/Goofy-Anime-Thing)[<img src="./README Assets/discord-icon.png" alt="[discord.com](https://ezekieltem.com/discord/)" width="30">](https://ezekieltem.com/discord/)[<img src="https://ezekieltem.com/Assets/icon.png" alt="My website" width="30">](https://ezekieltem.com/)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Locally Build](#locally-build)
- [Packaging](#packaging)
- [License](#license)
- [Disclaimer](#disclaimer)

## About

This is a joke desktop app built around a single animated asset and some intentionally over-the-top title text. The project exists mainly as a lightweight Electron experiment rather than a serious product.

![Gif Example](./README%20Assets/exampleGif.gif)

## Features

- Frameless Electron window with custom drag, minimize, and close controls
- Local asset loading through the webpack renderer bundle
- Randomized window title text from `src/Assets/map.json`
- Fixed-size `300x300` image rendering
- No account system, no updater, and no backend service

## Tech Stack

- Electron
- Electron Forge
- Webpack
- Plain HTML, CSS, and JavaScript

## Project Structure

```text
src/
  Assets/
    Gif/
    Img/
    map.json
  assets.js
  index.css
  index.html
  main.js
  preload.js
  renderer.js
```

## Locally Build

### Requirements

- Node.js
- npm
- Windows is the primary tested target in the current setup

### Clone the repository

```bash
git clone https://github.com/ezekieltem/Goofy-Anime-Thing.git
cd Goofy-Anime-Thing
```

### Install dependencies

```bash
npm install
```

### Start the app in development

```bash
npm start
```

This launches the Electron app through Electron Forge using the webpack development pipeline.

## Packaging

To create a packaged build:

```bash
npm run package
```

To generate distributable artifacts with Electron Forge makers:

```bash
npm run make
```

If packaging fails on your machine, check that your local Node/Electron toolchain is installed correctly and that your environment allows Electron Forge to create temporary build output.

## License

This repository is licensed under the MIT License. See [license](./license) for the full text.

## Disclaimer

This repository is provided for entertainment, experimentation, and source-available inspection. It is not represented as security software, anti-malware software, or a production-grade application.

To the best of the author's knowledge, the source currently published in this repository does not intentionally contain malware, spyware, credential theft logic, ransomware logic, hidden remote access functionality, or code written with malicious intent. The current app code is limited to a local Electron desktop window that displays bundled assets and local text metadata.

No guarantee is made that third-party mirrors, reposts, compiled binaries, modified forks, or unofficial downloads match the source in this repository. If you obtain a build from anywhere other than your own local compilation from reviewed source, you assume the risk of that binary.

You are responsible for reviewing the source, dependencies, build output, and any modifications before compiling or running the application. If you do not trust the code, do not run it.

This repository is distributed under the MIT License and is provided "as is", without warranty of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, and noninfringement. The author disclaims liability for damages, claims, losses, or other consequences arising from use, misuse, modification, redistribution, or execution of this project or any derivative build.

This README is not legal advice and does not create any contractual warranty, certification, audit statement, or security guarantee. If you need language tailored to your jurisdiction, your distribution model, or your business risk, talk to a qualified attorney.

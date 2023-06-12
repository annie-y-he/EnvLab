# Environmental Science Lab Web Project

- [Environmental Science Lab Web Project](#environmental-science-lab-web-project)
  - [Client Requirements](#client-requirements)
  - [Design Decisions](#design-decisions)
    - [Execution](#execution)
  - [Running locally](#running-locally)
    - [Project Setup](#project-setup)
    - [Compile and Hot-Reload for Development](#compile-and-hot-reload-for-development)
    - [Compile and Minify for Production](#compile-and-minify-for-production)
    - [Run on Local HTTP Server](#run-on-local-http-server)
    - [Commit and Push to GitHub](#commit-and-push-to-github)

## Client Requirements

- The client wants to reference Janna Levin's personal website [jannalevin.com](http://jannalevin.com/), on its floating objects and retro visual style.
- The client wants the background to be ocean.
- The website must be responsive to different devices, including desktops, tablets, and mobile phones.

## Design Decisions

**Frontend:** Vue  
**Backend:** Firebase  
**Database:** Cloud Firestore  

- The main page of this website should include some floating animated objects with physics and are interactable with a mouse object, such as through collision or other physics.
- The website will have two account types: user and admin.
    - User account username: `user`; password: `password1`
    - Admin account username: `admin`; password: `password2`
    - Both admin and user accounts can read, edit, and post articles.
    - Admin accounts can change both `password1` and `password2`.
- The login page will not be shown when visiting the website. It will only be shown when manually adding `/login` after the site address.
- After logging in, the user or admin will be able to add a new article or edit existing one with a rich text editor.

### Execution

1. Set up a development environment with the necessary frontend technologies installed.
2. Design and implement the frontend of the website using Vue.
3. Set up a Firebase project and enable Cloud Firestore as the database.
4. Configure Firebase Authentication to allow user authentication and authorization.
5. Implement the necessary Firebase Authentication and Cloud Firestore rules to handle user authentication, article creation, and article retrieval.
6. Test the website on a local development environment to ensure that it is running properly.
7. Deploy the website to Firebase Hosting.
8. Configure the website to use a custom domain name.
9. Launch the website and monitor its performance, making any necessary adjustments to ensure scalability and maintainability.

## Running locally

After cloning the repository to the local machine, these makefile instructions can be used for development.

### Project Setup

```sh
make install
```

### Compile and Hot-Reload for Development

```sh
make dev
```

### Compile and Minify for Production

```sh
make build
```

### Run on Local HTTP Server

```sh
make server
```

### Commit and Push to GitHub

```sh
make git
```
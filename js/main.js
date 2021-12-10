// Final Project Functions

//Function #1
function createElemWithText(elemType = "p", elemText = "", className) {
    const myElem = document.createElement(elemType);
    myElem.textContent = elemText;
    if(className) myElem.classList.add(className);
    return myElem;
}

//Function #2
function createSelectOptions(users) {
    const userArray = [];
    if (!users) return; 
    else {
        for (let i = 0; i < users.length; i++) {
            const option = document.createElement('option');
            option.value = users[i].id;
            option.textContent = users[i].name;
            userArray.push(option);
        }
    }
    return userArray;
}

//Function #3
function toggleCommentSection(postId) {
    if(!postId) return;
    const section = document.querySelector(`section[data-post-id='${postId}']`);
    if (!section) return section;
    section.classList.toggle('hide');
    return section;
}

//Function #4
function toggleCommentButton(postId) {
    if (!postId) return;
    const buttonSearch = document.querySelector(`button[data-post-id ='${postId}']`);
    if (!buttonSearch) return buttonSearch;
    if (buttonSearch.textContent === 'Show Comments') {
        buttonSearch.textContent = 'Hide Comments';
    }
    else {
        buttonSearch.textContent = 'Show Comments';
    }
    return buttonSearch;
}

//Function #5
function deleteChildElements(parentElement) {
    console.log(parentElement);
    if (!parentElement?.tagName) return;
    let child = parentElement.lastElementChild;
    console.log(child);
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild; 
    }
    return parentElement;
}

//Function #6
function addButtonListeners() {
    const mainNodes = document.querySelector('main');
    const button = mainNodes.querySelectorAll('button');
    if (button) {
        for (let i = 0; i < button.length; i++) {
            //get the postId from the button.dataset.id
            const postId = button[i].dataset.id;
            //add a click event listener to each button
            button[i].addEventListener("click", function (e) {toggleComments(e, postId)},false);
            //return the button elements which were selected
        }
    }
    return button;
}

//Function #7
function removeButtonListeners() {
    //selects all buttons nested inside the main element
    const mainNodes = document.querySelector('main');
    const button = mainNodes.querySelectorAll('button');
    //loops through the NodeList of buttons
    if (button) {
        for (let i = 0; i < button.length; i++) {
            //gets the postId from the button.dataset.id
            const postId = button[i].dataset.id;
            button[i].removeEventListener("click", function (e) {toggleComments(e, postId)},false);
        }
    }
    return button;
}

//Function #8
function createComments(comments) {
    //check if there are comments in the comments
    if (!comments) return comments;
    //creates a fragment element
    const fragment = document.createDocumentFragment();
    //loop through the JSON comments that are received
    for (let i = 0; i < comments.length; i++) {
        //create an article element 
        const myElement = document.createElement("article");
        const h3Heading = createElemWithText('h3', comments[i].name);
        const postParagraph = createElemWithText('p', comments[i].body);
        const emailParagraph = createElemWithText('p', `From: ${comments[i].email}`);
        myElement.append(h3Heading, postParagraph, emailParagraph);
        fragment.append(myElement);
    }
    return fragment;
}

//Function #9
function populateSelectMenu(users) {
    if (!users) return;
    //Select the #selectMenu element by id
    const selectMenu = document.getElementById('selectMenu');
    //passing the JSON user data to the createSelectOptions function
    const optionElements = createSelectOptions(users);
    //loop thorugh the array received to populate the empolyees option menu
    for (let i = 0; i < optionElements.length; i++) {
        selectMenu.append(optionElements[i]);
    }
    return selectMenu;
}

//Function #10
async function getUsers() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users/");
        const jsonUserData = await response.json();
        return await jsonUserData;
    }
    catch (e) {
        console.log(e.stack);
    }
}

//Function #11
async function getUserPosts(userId) {
    if (!userId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
        const jsonUserPosts = await response.json();
        return jsonUserPosts;
    }
    catch (e) {
        console.log(e.stack);
    }
}

//Function #12
async function getUser(userId) {
    if (!userId) return;
    try {
        const reponse = await fetch (`https://jsonplaceholder.typicode.com/users/${userId}`);
        const userData = await reponse.json();
        console.log(userData.company.catchPhrase);
        return userData;
    }
    catch (e) {
        console.log(e.stack);
    }
}

//Function #13
async function getPostComments(userId) {
    if (!userId) return;
    try {
        const response = await fetch (`https://jsonplaceholder.typicode.com/posts/${userId}/comments`);
        const userComments = await response.json();
        return userComments;
    }
    catch (e) {
        console.log(e.stack);
    }
}

//Function #14
async function displayComments(postId) {
    if (!postId) return;
    //create a section element 
    const newElement = document.createElement("section");
    //set an attribute on the section element with section.dataset.postId
    newElement.dataset.postId = postId;
    newElement.classList.add('comments');
    newElement.classList.add('hide');
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    newElement.append(fragment);
    return newElement;
}

//Function #15
async function createPosts(posts) {
    if (!posts) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < posts.length; i++) {
        const article = document.createElement("article");
        const header = document.createElement("h2")
        header.textContent = posts[i].title;
        const body = document.createElement("p")
        body.textContent = posts[i].body;
        const pPostId = document.createElement("p");
        pPostId.textContent = `Post ID: ${posts[i].id}`;
        const author = await getUser(posts[i].userId);
        const authorInfo = document.createElement("p");
        authorInfo.textContent = `Author: ${author.name} with ${author.company.name}`;
        const catchPhrase = document.createElement("p");
        catchPhrase.textContent = author.company.catchPhrase;
        const button = document.createElement("button");
        button.textContent = "Show Comments";
        button.dataset.postId = posts[i].id;
        article.append(header, body, pPostId, authorInfo, catchPhrase, button);
        const section = await displayComments(posts[i].id);
        article.append(section); 
        fragment.append(article);
    }
    return fragment;
}

//Function #16
async function displayPosts(posts) {
    //select the main element
    const main = document.querySelector('main');
    //define variable named element
    if (posts) {
        const element = await createPosts(posts);
        main.append(element);
        return element;
    }
    else {
        const element = document.createElement("p");
        element.textContent = "Select an Employee to display their posts.";
        element.classList.add('default-text');
        main.append(element);
        return element;
    }
}

//Function #17 
function toggleComments(event, postId) {
    if (!event && !postId) return;
    event.target.listener = true;
    const toggle = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    const newArray = [toggle, button];
    return newArray;
}

//Function #18
async function refreshPosts(posts) {
    if (!posts) return;
    const button = removeButtonListeners();
    const main = document.querySelector('main');
    const mainElement = deleteChildElements(main);
    const newPosts = await displayPosts(posts);
    const newButton = addButtonListeners();
    const newArray = [button, mainElement, newPosts, newButton];
    return newArray;
}

//Function #19
async function selectMenuChangeEventHandler(e) {
    const userId = e?.target?.value || 1;
    //console.log(userId);
    const getPosts = await getUserPosts(userId);
    const posts = await refreshPosts(getPosts);
    const newArray = [userId, getPosts, posts];
    return newArray;
}

//Function #20
async function initPage() {
    const users = await getUsers();
    const populate = populateSelectMenu(users);
    const newArray = [users, populate];
    return newArray;
}

//Function #21
function initApp() {
    const page = initPage();
    const menu = document.getElementById("selectMenu");
    menu.addEventListener("change", function (e) {selectMenuChangeEventHandler(e)}, false);
}

//Additional commands to make the App function
document.addEventListener("DOMContentLoaded", initApp, false);
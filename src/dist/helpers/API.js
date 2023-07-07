import axios from 'axios';



axios.defaults.baseURL = `${window.location.href}api`;
let endpoints = {
    'GET_PRODUCTS' : '/products/',
    'GET_REVIEWS' : '/reviews/',
    'POST_REVIEWS' : '/reviews/',
    'PUT_REVIEWS' : '/reviews/',
    'GET_QA_QUESTIONS' : '/qa/questions/',
    'POST_QA_QUESTION' : '/qa/questions/',
    'PUT_QA_QUESTION' : '/qa/questions/',
    'PUT_QA_ANSWER' : '/qa/answers/',
    'GET_CART' : '/cart/',
    'POST_CART': '/cart/',
    'POST_INTERACTIONS' : '/interactions/',
    'GET_OUTFIT' : '/outfit/',
    'POST_OUTFIT' : '/outfit/',
    'GET_SUPPORT' : '/service/'
};
//Retrieves the list of products.
let GET_PRODUCTS = (PAGE=1, COUNT=5) => {
    return axios.get(`${endpoints['GET_PRODUCTS']}?page=${PAGE}&count=${COUNT}`);
};

//Returns all product level information for a specified product id.
let GET_PRODUCT = (PRODUCT_ID) => {
    return axios.get(`${endpoints['GET_PRODUCTS']}${PRODUCT_ID}`);
};
//Returns the all styles available for the given product.
let GET_PRODUCT_STYLES = (PRODUCT_ID) => {
    return axios.get(`${endpoints['GET_PRODUCTS']}${PRODUCT_ID}/styles`);
};
//Returns the id's of products related to the product specified.
let GET_PRODUCT_RELATED = (PRODUCT_ID) => {
    return axios.get(`${endpoints['GET_PRODUCTS']}${PRODUCT_ID}/related`);
};

//https://learn-2.galvanize.com/cohorts/3849/blocks/94/content_files/Front%20End%20Capstone/project-atelier-catwalk/reviews.md
//Sort options -> newest, helpful, relevant
//Returns a list of reviews for a particular product. This list does not include any reported reviews.
let GET_REVIEWS = (PRODUCT_ID, PAGE=1, COUNT=5, SORT='newest') => {
    return axios.get(`${endpoints['GET_REVIEWS']}?product_id=${PRODUCT_ID}&page=${PAGE}&count=${COUNT}&sort=${SORT}`);
};
//Returns review metadata for a given product.
let GET_REVIEWS_META = (PRODUCT_ID) => {
  return axios.get(`${endpoints['GET_REVIEWS']}meta?product_id=${PRODUCT_ID}`);
};
//Adds a review for the given product.
/*
{
    product_id : int,
    rating : int,
    summary : text,
    body : text,
    recommend : bool,
    name : text,
    email : text,
    photos : [text], //array of text urls
    characteristics : {} //	Object of keys representing characteristic_id and values representing the review value for that characteristic. { "14": 5, "15": 5 //...}
}
*/
let POST_REVIEWS = (BODY) => {
    return axios.post(`${endpoints['POST_REVIEWS']}`, BODY);
};
//Updates a review to show it was found helpful.
let PUT_REVIEW_HELPFUL = (REVIEW_ID) => {
    return axios.put(`${endpoints['POST_REVIEWS']}${REVIEW_ID}/helpful`);
};
//Updates a review to show it was reported. Note, this action does not delete the review, but the review will not be returned in the above GET request.
let PUT_REVIEW_REPORT = (REVIEW_ID) => {
    return axios.put(`${endpoints['POST_REVIEWS']}${REVIEW_ID}/report`);
};

//Retrieves a list of questions for a particular product. This list does not include any reported questions.
let GET_QA_QUESTIONS = (PRODUCT_ID, PAGE=1, COUNT=5) => {
    return axios.get(`${endpoints['GET_QA_QUESTIONS']}?product_id=${PRODUCT_ID}&page=${PAGE}&count=${COUNT}`);
};
//Returns answers for a given question. This list does not include any reported answers.
let GET_QA_QUESTION_ANSWERS = (QUESTION_ID, PAGE=1, COUNT=5) => {
    return axios.get(`${endpoints['GET_QA_QUESTIONS']}${QUESTION_ID}/answers?page=${PAGE}&count=${COUNT}`);
};
//Adds a question for the given product
/*body ->
{
    body: text //Text of question being asked
    name: text //Username for question asker
    email: text //Email of question asker
    product_id: //Required ID of the product for which the question is posted
}

*/
let POST_QA_QUESTION = (BODY) => {
    return axios.post(`${endpoints['POST_QA_QUESTION']}`, BODY);
}
//Adds an answer for the given question
/*body ->
{
    body: text //Text of question being asked
    name: text //Username for question asker
    email: text //Email of question asker
    photos: [text] //An array of URLS corresponding to images to display
}

*/
let POST_QA_QUESTION_ANSWER = (QUESTION_ID, BODY) => {
    return axios.post(`${endpoints['POST_QA_QUESTION']}${QUESTION_ID}/answers`, BODY);
}
//Updates a question to show it was found helpful.
let PUT_QA_QUESTION_HELPFUL = (QUESTION_ID) => {
    return axios.put(`${endpoints['PUT_QA_QUESTION']}${QUESTION_ID}/helpful`);
}
//Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request.
let PUT_QA_QUESTION_REPORT = (QUESTION_ID) => {
    return axios.put(`${endpoints['PUT_QA_QUESTION']}${QUESTION_ID}/report`);
}
//Updates an answer to show it was found helpful.
let PUT_QA_ANSWER_HELPFUL = (ANSWER_ID) => {
    return axios.put(`${endpoints['PUT_QA_ANSWER']}${ANSWER_ID}/helpful`);
};
//Updates an answer to show it has been reported. Note, this action does not delete the answer, but the answer will not be returned in the above GET request.
let PUT_QA_ANSWER_REPORT = (ANSWER_ID) => {
    return axios.put(`${endpoints['PUT_QA_ANSWER']}${ANSWER_ID}/report`);
};

//Retrieves list of products added to the cart by a user.
let GET_CART = () => {
    return axios.get(`${endpoints['GET_CART']}`);
};
//Adds a product to the cart.
/*
body ->
{
    sku_id : int //	ID for the product being added to the cart
}
*/
let POST_CART = (BODY) => {
    return axios.post(`${endpoints['BODY_CART']}`, BODY);
};



//Adds a interaction to the db.
/*
body ->
{
    element : String //Required. Selector for the element which was clicked
    widget : String //Required. Name of the module/widget in which the click occured
    time : String //Required. Time the interaction occurred

}
*/
let POST_INTERACTION = (BODY) => {
    return axios.post(`${endpoints['POST_INTERACTIONS']}`, BODY);
}
//pulls the outfit from our /outfit endpoint. this grabs the data from redis
let GET_OUTFIT = () => {
    return axios.get(`${axios.defaults.baseURL.replace('/api', '')}${endpoints['GET_OUTFIT']}`);
}
//posts a outfit to redis.
let POST_OUTFIT = (BODY) => {
    return axios.post(`${axios.defaults.baseURL.replace('/api', '')}${endpoints['POST_OUTFIT']}`, BODY);
}
//update the outfit. (removal!)
let PUT_OUTFIT = (BODY) => {
    return axios.put(`${axios.defaults.baseURL.replace('/api', '')}${endpoints['POST_OUTFIT']}`, BODY);
}

let GET_SUPPORT = (QUESTION) => {
    return axios.get(`${axios.defaults.baseURL.replace('/api', '')}${endpoints['GET_SUPPORT']}?question=${QUESTION}`);
};
export default {
    GET_PRODUCTS,
    GET_PRODUCT,
    GET_PRODUCT_STYLES,
    GET_PRODUCT_RELATED,
    GET_REVIEWS,
    GET_REVIEWS_META,
    POST_REVIEWS,
    PUT_REVIEW_HELPFUL,
    PUT_REVIEW_REPORT,
    GET_QA_QUESTIONS,
    GET_QA_QUESTION_ANSWERS,
    POST_QA_QUESTION,
    POST_QA_QUESTION_ANSWER,
    PUT_QA_QUESTION_HELPFUL,
    PUT_QA_QUESTION_REPORT,
    PUT_QA_ANSWER_HELPFUL,
    PUT_QA_ANSWER_REPORT,
    GET_CART,
    POST_CART,
    POST_INTERACTION,
    GET_OUTFIT,
    POST_OUTFIT,
    PUT_OUTFIT,
    GET_SUPPORT
};


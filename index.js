const express = require('express');
const path = require('path');
const {token, port} = require('./config.js');
const axios = require('axios');
const { createClient } = require('redis');
const { chatter } = require('./server/chat.js');
const compression = require('compression');


//https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-22-04
//https://redis.io/docs/getting-started/installation/install-redis-on-windows/
//https://www.baeldung.com/redis-delete-data


const app = express();
const configPort = port || 3000;
const client = createClient();
client.connect().then((response) => {
    console.log('Connected to redis.');
}).catch((error) => {
    console.log(error);
});

app.use(express.static(path.join(__dirname, './src/dist')));
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));



app.all('/api*', (req, res) => {
    //https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe
    let targetUrl = `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe${req.url.replace('/api', '')}`;
    client.get(targetUrl).then((redisResponse) => {
        if(redisResponse !== null){
            console.log('loaded from the cache!');
            res.send(JSON.parse(redisResponse));
        }else{
            axios({
                method: req.method,
                url: targetUrl,
                data: req.body,
                headers:{
                    'Authorization' : token
                }
            }).then((response) => {                
                if(req.method === 'GET' && targetUrl.startsWith('https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/products')){
                    client.set(targetUrl, JSON.stringify(response.data)).then((error) => {
                        console.log('Added data to cache!');
                    }).catch((error) => {
                        console.log('Error storing data in cache');
                    });
                }
                res.send(response.data);
            }).catch((error) => {
                //sending the error back contains the git token 0_0
                res.send('error!!');
            });
        }
    }).catch((error) => {
        res.send([]);
    });
});
    

app.get('/outfit', (req, res) => {
    console.log('hit!');
    client.get('outfit').then((response) => {
        res.send(response);
    }).catch((error) => {
        res.send(error);
    });

});
app.post('/outfit', (req, res) => {
    /*
    owner? may not be needed here, but if there's no owner then all connections share the same outfit list.
        [{id
        size?,
        category,
        name,
        price}]
    */
    client.get('outfit').then((response) => {
        let base = response ? JSON.parse(response) : {outfit:[]};
        base.outfit.push({...req.body});
        client.set('outfit', JSON.stringify(base)).then((response) => {
            res.send(response);
        }).catch((error) => {
            res.send(error);
        });
    }).catch((error) => {
        res.send(error);
    });
});
app.put('/outfit', (req, res) => {
    client.get('outfit').then((outfit) => {
        if(outfit){
            let target = req.body.id;
            outfit = JSON.parse(outfit);
            let updater = () => {
                let arr = outfit.outfit;
                for(let x = 0; x < arr.length; x++){
                    if(arr[x].id === target){
                        arr.splice(x, 1);
                        return arr;
                    }
                }
            };
            let updated = updater();
            console.log(updated);
            client.set('outfit', JSON.stringify({outfit:[...updated]})).then((finito) => {
                console.log(updated);
                res.send();


            }).catch((error) => {
                res.sendStatus(400);
                res.send();
            });

        }else{
            res.sendStatus(400);
            res.send();
        }

    }).catch((error) => {
        res.sendStatus(400);
        res.send();
    });

});






//Customer service?

app.get('/service', (req, res) => {
    let question = req.query.question;    
    if(question) {
        chatter.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{
                role:'user',
                content:`Using this dataset below, please act as a customer service representative for my store Squidward-inc. 
                I want the response to be a JSON object, with your response within the object. 
                Also, if the customer requests a certain product, please list that product's id within the JSON response as well under a key named productIds. 
                This should be an array of relevant productIds. Any questions asked unrelated to the contents of my store should be responded to with a default message. 
                This message is "Squidward aint got time for that kinda stuff."
                My dataset is :

                [
                    {
                        "id": 37311,
                        "name": "Camo Onesie",
                        "slogan": "Blend in to your crowd",
                        "description": "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
                        "category": "Jackets",
                        "default_price": "140.00"
                    },
                    {
                        "id": 37312,
                        "name": "Bright Future Sunglasses",
                        "slogan": "You've got to wear shades",
                        "description": "Where you're going you might not need roads, but you definitely need some shades. Give those baby blues a rest and let the future shine bright on these timeless lenses.",
                        "category": "Accessories",
                        "default_price": "69.00"
                    },
                    {
                        "id": 37313,
                        "name": "Morning Joggers",
                        "slogan": "Make yourself a morning person",
                        "description": "Whether you're a morning person or not.  Whether you're gym bound or not.  Everyone looks good in joggers.",
                        "category": "Pants",
                        "default_price": "40.00"
                    },
                    {
                        "id": 37314,
                        "name": "Slacker's Slacks",
                        "slogan": "Comfortable for everything, or nothing",
                        "description": "I'll tell you how great they are after I nap for a bit.",
                        "category": "Pants",
                        "default_price": "65.00"
                    },
                    {
                        "id": 37315,
                        "name": "Heir Force Ones",
                        "slogan": "A sneaker dynasty",
                        "description": "Now where da boxes where I keep mine? You should peep mine, maybe once or twice but never three times. I'm just a sneaker pro, I love Pumas and shell toes, but can't nothin compare to a fresh crispy white pearl",
                        "category": "Kicks",
                        "default_price": "99.00"
                    },
                    {
                        "id": 37316,
                        "name": "Pumped Up Kicks",
                        "slogan": "Faster than a just about anything",
                        "description": "The Pumped Up serves up crisp court style with a modern look. These shoes show off tennis-whites shades and are constructed with a supple leather upper and a classic rubber cupsole.",
                        "category": "Kicks",
                        "default_price": "89.00"
                    },
                    {
                        "id": 37317,
                        "name": "Blues Suede Shoes",
                        "slogan": "2019 Stanley Cup Limited Edition",
                        "description": "Touch down in the land of the Delta Blues in the middle of the pouring rain",
                        "category": "Dress Shoes",
                        "default_price": "120.00"
                    },
                    {
                        "id": 37318,
                        "name": "YEasy 350",
                        "slogan": "Just jumped over jumpman",
                        "description": "These stretchy knit shoes show off asymmetrical lacing and a big sculpted rubber midsole. In a nod to adidas soccer heritage.",
                        "category": "Kicks",
                        "default_price": "450.00"
                    },
                    {
                        "id": 37319,
                        "name": "Summer Shoes",
                        "slogan": "A risky call in the spring or fall",
                        "description": "Low-top panelled buffed leather and mesh sneakers. Sizing embroidered in black at round toe. Tonal lace-up closure. Pull-loop and rubberized style name at padded tongue. Padded collar. Pull-loop at heel collar. Logo embroidered in black at outer side. Tonal treaded rubber sole. Tonal stitching.",
                        "category": "Kicks",
                        "default_price": "59.00"
                    },
                    {
                        "id": 37320,
                        "name": "Infinity Stone",
                        "slogan": "Reality is often disappointing. That is, it was. Now, reality can be whatever I want.",
                        "description": "The Infinity Stones are six immensely powerful stone-like objects tied to different aspects of the universe, created by the Cosmic Entities. Each of the stones possesses unique capabilities that have been enhanced and altered by various alien civilizations for millennia.",
                        "category": "Accessories",
                        "default_price": "50000000.00"
                    }
                ]
                
                My customer has a question. Please respond politely and only respond with an answer related to the contents of my store as provided in the dataset above.                
                My customer's question is :${question}
                `
            }]
        }).then((response) => {
            res.send(response.data.choices[0].message.content);
        }).catch((error) => {
            console.log(error);
        });
    }else{
        res.send('Provide a question to use this endpoint');
    }
    
});

app.listen(configPort, () => console.log(`app listening on port ${configPort}!`));


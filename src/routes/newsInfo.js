const newsRoutes = require('express').Router();
const bodyParser = require('body-parser');
const URLSearchParams = require('url-search-params');
const verifyToken = require('../middleware/authJWT');
var User = require('../models/user');
const {newsApi} = require('../routes/newsInfoHelper');

newsRoutes.use(bodyParser.json());

let url = 'https://newsapi.org/v2/top-headlines';


//Get News based on preferences
newsRoutes.get('', verifyToken, async(req, res) => { 
    try { 
        if(!req.user && req.message){
            return res.status(403).send({
                message: req.message
            });
        }
        if(!req.user && req.message == null){
            return res.status(401).send({
                message: "Invalid JWT token"
            });
        }
        const searchParams = new URLSearchParams();
        if (req.user.newsPreferences) {
            const arrayPreferences = req.user.newsPreferences;
            for(let i=0; i<arrayPreferences.length; i++) { 
                searchParams.append('category', arrayPreferences[i]);
            };
            searchParams.append('apiKey', process.env.NEWS_API_KEY);
            console.log(`${url}?${searchParams}`);
            try { 
                let resp = await newsApi(`${url}?${searchParams}`);
                res.status(200).json(resp.articles);
            } catch (err) { 
                res.status(500).json({ error: err });
            }           
        } else {
            console.log("User preferences not provided");
        }
        
    }catch(error){
        return res.status(500).send("Error occured in fetching news based on preference.");
    }
});

module.exports = newsRoutes;
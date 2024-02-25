const mongoose = require("mongoose");
const sampleData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" ; 

main().then(()=> {
    console.log("connected to wanderlust db");
}).catch((err)=> {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const categories = ["Amazing-View", "Play", "Tiny-Home", "Tree-House", "Farm", "Amazing-Pools", "Arctic", "Beach", "Mountain", "Peaceful", "Wild-Life", "OMG", "Yoga", "Nature", "Trending"];

// Function to pick a random category
function pickRandomCategory() {
  const randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
}

const initData = async()=> {
    try {
        await Listing.deleteMany({}); 
        const listingWithImageUrl = sampleData.data.map((item)=>({
            ...item , 
            owner : "65d32b186acc8d4c130ea0a5",
            category : pickRandomCategory(),
            geometry: {
                type: 'Point',
                coordinates: [72.5714, 23.0225] // Replace with the actual coordinates of Ahmedabad
            }
        }));
    
        await Listing.insertMany(listingWithImageUrl);
        console.log("data was initialized!!");

    } catch(err) {
        console.log(`error in initializing data : ${err}`);
    }
   
}

initData();
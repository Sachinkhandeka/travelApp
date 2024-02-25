const Listing = require("../models/listings");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN ; 
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.indexController = async(req ,res)=> {
    const listings = await Listing.find({});

    res.render("./pages/index.ejs" , {listings});
}

module.exports.filterListingController = async(req ,res)=> {
    const filterId = req.params.filterId ; 
    
    let listings = await Listing.find({ category : filterId});

    if(!listings.length) {
        req.flash("error" ,"Opps! Listing with this category does not exists");
        return res.redirect("/listings");
    }

    res.render("./pages/filteredListing" ,{ listings });
}

module.exports.viewController = async(req ,res)=> {
    const { id } = req.params ; 

    const listing = await Listing.findById(id)
       .populate({ 
           path : "reviews" , 
           populate : {
              path : "author" /*  nested populate  */
            }
        })
       .populate("owner");

    if(!listing) {
        req.flash("error" , "Listing Deleted or Does Not Exists");
        return res.redirect("/listings");
    }
    res.render("./pages/listing.ejs" ,  {listing});
    
}

//create async callback -post route
module.exports.createNewController = async(req ,res)=> {
    //fetching coordinates from mbx-using forwardGeoCode-service
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();


    let url = req.file.path ; 
    let filename  = req.file.filename; 
    
    const { listing } = req.body; 
    let newListing = new Listing(listing);
    newListing.owner = req.user._id ;
    newListing.image = {url,filename};

    newListing.geometry = response.body.features[0].geometry ; 

    let savedListing = await newListing.save(); 
    console.log(savedListing);
    req.flash("success" , "New Listing Created");
    res.redirect("/listings");

}

//edit form async callback
module.exports.editFormController = async(req ,res)=> {
    const { id } = req.params ;  

    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error" , "Listing Deleted or Does Not Exists");
        return res.redirect("/listings");
    }
    let originalUrl =  listing.image.url;
    originalUrl = originalUrl.replace("/upload" , "/upload/h_300,w_250");
    res.render("./pages/edit.ejs" , { listing , originalUrl });
}

//update async callback - put route
module.exports.updateListingController = async(req ,res)=>{
    const { id } = req.params ;

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();

    let listing = await Listing.findByIdAndUpdate(id ,{...req.body.listing , geometry: response.body.features[0].geometry});

    if( typeof req.file !== "undefined") {
        let url = req.file.path ; 
        let filename  = req.file.filename; 
        listing.image = { url , filename } ; 
        await listing.save();
    }

    req.flash("success" , "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
    
}

//destroy calback - delete route 
module.exports.destroyListingController = async(req ,res)=> {
    const { id } = req.params ;

    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted Successfully");
    res.redirect(`/listings`);
}

//filter controller 
module.exports.filterController = async(req ,res)=> {
    let searchTerm = req.query;
    let filter = searchTerm.filter ; 

    const listings = await Listing.find({ 
        $or : [
            {
                title : { $regex : new RegExp( filter , 'i') },
            },
            {       
                description : { $regex : new RegExp( filter , 'i') },
            },
            {
                location : { $regex : new RegExp( filter , 'i') },
            },
            {
                country : { $regex : new RegExp( filter , 'i') },
            },
            {
                category : { $regex : new RegExp( filter , 'i') },
            }
    ]
    });
    // console.log(listings);

    if(!listings || listings.length ===  0 ) {
        req.flash("error" , `Listing with ${filter} not found`);
        return res.redirect("/listings");
    }
    // console.log(listings);
    req.query = {};
    res.render("./pages/index.ejs" , { listings });
}

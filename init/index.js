const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const Mongo_URL= 'mongodb://127.0.0.1:27017/wonderlust';
 
main().then(()=>{
    console.log('Database is connected');
    
 }).catch((err)=>{
    console.log(err);
    
 })

async function main(){
    await mongoose.connect(Mongo_URL);
}

// async function initDB() {
//   try {
//       await Listing.deleteMany({});
     
//          initData.data=initData.data.map((obj)=>({...obj,owner:"683489a54c1f1d1076214578"}));
//       //Ensure image field is a string
//       const correctedData = initData.data.map(item => {
//           if (typeof item.img === 'object') {
//               item.img = JSON.stringify(item.img);
//           }
//           return item;


//       });

//       await Listing.insertMany(correctedData)
//       console.log("Data was initialized");
//   } catch (error) {
//       console.error("Error initializing data:", error);
//   }
// }


// initDB();

const initDB = async ()=>{
  await Listing.deleteMany({})
  initData.data = initData.data.map((obj)=>({...obj, owner: "683489a54c1f1d1076214578"}))
  await Listing.insertMany(initData.data)
  console.log("Data was initialized");
}

initDB();
const mongoose = require('mongoose');
async function connect (){
    try{
        await mongoose.connect(process.env.DATABASE);
        console.log('connect succesfully')
        
    }   
    catch(error){
        console.log('lỗi ' + error)
    }
}

module.exports = {connect}
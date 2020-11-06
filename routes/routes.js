const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const router = express.Router();
//const path = require('path');
const User = require('../models/user');
const Order = require('../models/order');
const envFile = require('../config/config')



router.post('/api/create/user',(req,res,next) =>{
  console.log("Req",req.body)
  const user = new User({
      userId: req.body.userId,
      name: req.body.name
  });
  user.save()
  res.status(200).json({message:'User Created'});
})

router.post('/api/create/order',(req,res,next) =>{
  console.log("Req",req.body)
  const order = new Order({
      userId: req.body.userId,
      orderId: req.body.orderId,
      subtotal: req.body.subtotal,
      date: new Date()
  });
  order.save();
  res.status(200).json({message:'Order Created'});
})

router.get('/api/get/all/orders/count',async(req,res,next)=>{

  try{
    let noOfOrders = {};
    let sum ={};
    let name ={};
    let avg ={};
    
    let getallOrders = ()=>{
      return new Promise(async(resolve,reject)=>{
        const allOrders = await Order.find({});
        resolve(allOrders);
      })
    }
    const result = await getallOrders();
    if(result.length > 0){
      let getUniqueUsers = ()=>{
        return new Promise(async(resolve,reject)=>{
          const allUsers = result.map( value => {
            noOfOrders[value.userId] = (noOfOrders[value.userId] ||0) +1;
            return value.userId
        });
        //stores all unique users from allUsers array
        const uniqueUsers = [...new Set(allUsers)];
        resolve(uniqueUsers)
        })
      }
      let createUserData = ()=>{
        return new Promise(async(resolve,reject)=>{
          let userObj = [];
          const uniqueUsers = await getUniqueUsers();
          //computes the sum 
          for(let i =0;i<result.length;i++){
            for(let j=0;j<uniqueUsers.length;j++){
              if(result[i].userId == uniqueUsers[j]){
                sum[uniqueUsers[j]] = result[i].subtotal +(sum[uniqueUsers[j]]||0);
              }
            }
          }
          //Final user Object formulated
          for(let i=0;i<uniqueUsers.length;i++){
            avg[uniqueUsers[i]] = sum[uniqueUsers[i]]/noOfOrders[uniqueUsers[i]];
            const userDetails = await User.find({userId:uniqueUsers[i]});
            name[uniqueUsers[i]] = userDetails[0].name;
            const payload={
              userId:uniqueUsers[i],
              noOfOrders: noOfOrders[uniqueUsers[i]],
              name: name[uniqueUsers[i]],
              averageBillValue: avg[uniqueUsers[i]]
            }
            userObj.push(payload)
          }
          resolve(userObj)
        })
     }
     const UserData = await createUserData();
      
    res.status(200).json({success:true,result:UserData})
    }else {
      res.status(400).json({success:true,message:"No Records"})
    }
  }catch(e){
    console.log("Error in Orders count API",e);
    res.status(400).json({success:true,message:"Error"})
  }

})

router.post('/api/user/update',async(req,res,next)=>{
  try{
    const response = await axios.get('http://localhost:3000/api/get/all/orders/count');
    console.log("Response",response.data);
    const data = response.data;
    if(data.hasOwnProperty('result') && data.result.length >0){
      const UserUpdate = data.result.map( async(value,index)=>{
        const updateUser = await User.updateOne({userId:value.userId},{noOfOrders:value.noOfOrders});
        if(updateUser.nModified == 1){
          return true;
        }
      })
      if(UserUpdate){
        res.status(200).json({success:true,message:'Successfully Updated'});
      }else{
        res.status(200).json({success:true,message:'Unable to update records'})
      }
    }else{
      res.status(400).json({success:true,message:'No Records'})
    }
  }catch(e){
    console.log("Error at user Update",e);
    res.status(400).json({success:true,message:'Error'})
  }
  
})


module.exports = router;
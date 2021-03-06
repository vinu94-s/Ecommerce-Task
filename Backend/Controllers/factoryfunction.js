const APIFeatures = require('../util/apiFeatures');
const catchAsync = require('./../util/catchAsync');
const ErrorHandle = require('./../util/Errorhandler');

exports.getALL = (Modal)=>catchAsync(async (req,res,next)=>{


  let fi  = {};//for nested review route
  if(req.params.productid)fi = {
      tour:req.params.productid
  }
 let page = req.query.page || 1;
  const filter = new APIFeatures(Modal.find(fi),req.query).search().filter().limitFeild().pagitaion().sort();
  const doc = await filter.query;
    res.status(200).json({
     status:'success',
     doc,
     page
  });
  });
  
  exports.deleteOne = Modal=> catchAsync( async (req,res,next)=>{
    const doc = await Modal.findByIdAndDelete(req.params.id)
  
      if(!doc){
          return next(new ErrorHandle("doc cannot be foud",404));
      }
      res.status(204).json({
          status:'success',
           data:null
      })
  });
  
  exports.updateOne = Modal =>catchAsync( async (req,res,next)=>{
    const doc = await Modal.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
  
    if(!doc){ //handlig doc null error 404
        return next(new ErrorHandle("doc cannot be foud",404));
      }
  
    res.status(200).json({
       status:'success',
       doc
   });
  }); 
  
  exports.createOne = Modal=> catchAsync( async (req,res,next)=>{
    //  console.log("adding....");
    const doc = await Modal.create(req.body);
  
    res.status(201).json({
      status:'success',
      doc
  });
  });
  
  exports.getOne = (Modal,popoptions) =>catchAsync(async (req,res,next)=>{
  //  console.log("request");
    let query =  Modal.findById(req.params.id);
    if(popoptions)
    query = query.populate(popoptions);
    const doc = await query;
     
    if(!doc){ //handlig doc null error 404
      return next(new ErrorHandle("doc cannot be foud",404));
    }
    // const doc = docs.find(el =>el.id ===id);
    res.status(200).json({
        status:'success',
        doc
    });
  });


  exports.deleteAll = (Modal)=>catchAsync(async(req,res,next)=>{

     await Modal.deleteMany();

     res.status(204).json({
       message:"Operation Successfull",

     });

  });
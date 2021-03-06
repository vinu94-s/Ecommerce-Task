const User = require('../Modal/Usermodal');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/Errorhandler');
const factory = require('./factoryfunction');
const Ship = require('../Modal/shipingAddress');
const multer = require('multer');
const sharp = require('sharp')
let log = console.log;

// const multerStorage = multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,'public/img/users')
//   },
//   filename:(req,file,cb)=>{
//     const ext = file.mimetype.split('/')[1];
//     cb(null,`user-${req.user._id}-${Date.now()}.${ext}`)
//   }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image'))
  cb(null,true);
  else{
    cb(new AppError('Upload Photo only!!',400),false);
  }
}

const upload = multer({
  storage:multerStorage,
  fileFilter:multerFilter
});

exports.uploadPhoto =  upload.single('photo');
exports.resizeImage = catchAsync(async (req,res,next)=>{
  if(!req.file) return next();
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

 await sharp(req.file.buffer).resize(500,500)
                       .toFormat('jpeg')
                       .jpeg({quality:90})
                       .toFile(`public/img/users/${req.file.filename}`);
  next();
});



function filterObject(obj,allowed){
    let newobj = {};
    Object.keys(obj).forEach((el)=>{
          if(allowed.includes(el))
            newobj[el] = obj[el];
             
    });
    return newobj;
}

exports.getMe = catchAsync(async (req,res,next)=>{
   // console.log(`from getMe ${req.user}`)
    req.params.id= req.user._id;
   // console.log(req.params);
    next();
});


exports.updateMe = catchAsync(async (req,res,next)=>{
   //console.log(req.params);
   //log('Started');
    let allowedupdate = ['name','email','shippingAddress'];
    if(req.body.password || req.body.confirmPassword)
    next(new AppError('Password cannot be updated using this route',400));
     const obj = filterObject(req.body,allowedupdate);
     
     if(req.file) obj.photo = req.file.filename;
   //  console.log(req.file.path);
     // console.log(obj);
     let doc;
     if('shippingAddress' in obj){
        // log("Found Address");
       //  log(obj.shippingAddress);
        const Address = new Ship(obj.shippingAddress);
        Address.user = req.user._id;
        await Address.save();

        // doc = await User.findById(req.user._id);
       // req.user.shippingAddress.push(Address._id);
      //  doc.shippingAddress.push(Address._id);
      
    //  await req.user.save();
   //  let up=  await User.findById(req.user._id);
      doc = await User.findById(req.user._id);
       // log("Done");

     }
     else{
          
        doc = await User.findByIdAndUpdate(req.user._id,obj,{
        runValidators:true,
        new:true
    });
     }
   
   //  console.log(doc);
     res.status(200).json({
         status:"success",
         message:"Data updated successfully ",
         doc
     })
     
         
})

exports.getuser =factory.getOne(User);
exports. getAllusers =factory.getALL(User);
exports. updateuser =factory.updateOne(User);
exports. deleteuser = factory.deleteOne(User);
exports.deleteAll = factory.deleteAll(User);

exports. newuser = (req,res)=>{
    res.status(500).json({
        status:"Error",
        message:"Route not defined"
    });
}
const users = require("../models/userSchema");
const userotp = require("../models/userOtp");
const nodemailer = require("nodemailer");
const userotpmobile = require("../models/userOtpMobile");
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
// email config

const tarnsporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


exports.userregister = async (req, res) => {
    const { fname, email, password,pnumber } = req.body;

    if (!fname || !email || !password || !pnumber) {
        res.status(400).json({ error: "Fill in all the fields" })
    }

    try {
        const presuer = await users.findOne({ email: email });

        if (presuer) {
            res.status(400).json({ error: "user already exists in the database" })
        } else {
            const userregister = new users({
                fname, email, password,pnumber
            });
            const storeData = await userregister.save();
            res.status(200).json(storeData);
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }

};



// user send otp
exports.userOtpSend = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: "Please enter your Email" })
    }


    try {
        const presuer = await users.findOne({ email: email });

        if (presuer) {
            const OTP = Math.floor(100000 + Math.random() * 900000);

            const existEmail = await userotp.findOne({ email: email });


            if (existEmail) {
                const updateData = await userotp.findByIdAndUpdate({ _id: existEmail._id }, {
                    otp: OTP
                }, { new: true }
                );
                await updateData.save();

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Email For OTP Validation",
                    text: `OTP:- ${OTP}`
                }


                tarnsporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "email not sent" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ message: "Email sent successfully" })
                    }
                })

            } else {

                const saveOtpData = new userotp({
                    email, otp: OTP
                });

                await saveOtpData.save();
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Email For OTP Validation",
                    text: `OTP:- ${OTP}`
                }

                tarnsporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "Email not sent" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ message: "Email sent successfully" })
                    }
                })
            }
        } else {
            res.status(400).json({ error: "User doesn't exist in the database" })
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
};


exports.userLogin = async(req,res)=>{
    const {email,otp} = req.body;

    if(!otp || !email){
        res.status(400).json({ error: "Please Enter Your OTP and email" })
    }

    try {
        const otpverification = await userotp.findOne({email:email});

        if(otpverification.otp === otp){
            const preuser = await users.findOne({email:email});

            // token generate
            const token = await preuser.generateAuthtoken();
           res.status(200).json({message:"User Login succesfully done",userToken:token});
           





        }else{
            res.status(400).json({error:"Invalid OTP"})
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
}
exports.userLoginOtp = async(req,res)=>{
    const {pnumber,otp} = req.body;

    if(!otp || !pnumber){
        res.status(400).json({ error: "Please Enter Your OTP and mobile number" })
    }

    try {
        const otpverificationmobile = await userotpmobile.findOne({pnumber:pnumber});

        if(otpverificationmobile.otp === otp){
            const preuser = await users.findOne({pnumber:pnumber});

            // token generate
            const token = await preuser.generateAuthtoken();
           res.status(200).json({message:"User Login succesfully done",userToken:token});

        }else{
            res.status(400).json({error:"Invalid OTP"})
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
}
exports.userOtpSendMobile = async (req, res) => {
    const { pnumber } = req.body;

    if (!pnumber) {
        res.status(400).json({ error: "Please enter your Mobile number" })
    }

    try {
        const presuer = await users.findOne({ pnumber: pnumber});

        if (presuer) {
            const OTP = Math.floor(100000 + Math.random() * 900000);

            const existMobile = await userotpmobile.findOne({pnumber: pnumber });


            if (existMobile) {
                const updateData = await userotpmobile.findByIdAndUpdate({ _id: existMobile._id }, {
                    otp: OTP
                }, { new: true }
                );
                await updateData.save();
                client.messages.create({
                    body:"Your OTP is"+ OTP,
                    to:'+91'+pnumber,
                    from:process.env.TWILIO_PHONE_NUMBER
                }).then( message => console.log(message))
                  .catch(error => console.log(error))
            } else {

                const saveOtpData = new userotpmobile({
                    pnumber, otp: OTP
                });

                await saveOtpData.save();
                
                client.messages.create({
                    body:"Your OTP is" + OTP,
                    to:'+91'+pnumber,
                    from:process.env.TWILIO_PHONE_NUMBER
                }).then( message => console.log(message))
                  .catch(error => console.log(error))
            }
        } else {
            res.status(400).json({ error: "User doesn't exist in the database" })
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
};
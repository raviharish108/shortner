import nodemailer from "nodemailer"

export const successEmail=async(email,txt)=>{
    const transporter = nodemailer.createTransport({
       service:"gmail",
        auth: {
          user:process.env.email, 
          pass:process.env.password, 
        }
    });
    const message = {
        from: process.env.email,
        to: email,
        subject: txt,
        html:`
           <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Url Shortner App.</h2>
            <p>${txt}</p>
            <div style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</div>
            </div>`
       
    };
    await transporter.sendMail(message, function(error, info){ 
        if (error) { 
          console.log(error); 
        } else { 
          console.log('Email sent: ' + info.response); 
        } 
      });


}
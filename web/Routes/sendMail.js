
import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport(({
    host: process.env.SAND_GRID_HOST,
    port: process.env.SAND_GRID_PORT,
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
    }
}));

export default async function sendMail(user_name, user_email, shop_name, couponCode) {

    try {
        let info = await transporter.sendMail({
            from: `"${(shop_name).split(".")[0]}" <${process.env.SENDGRID_EMAIL}>`,
            to: `${user_email}`,
            subject: "Heading of the mail",
            text: `Message will go here`,

            html: `Message will go here with html elements`,
        });

        console.log("mail info from sendMail ", info);
        return { message: "Email send to the user ", success: true }
    }
    catch (err) {
        console.log("err from mail sending ", err)
        return { message: "Email cant't bt sent to the user ", success: false }
    }
}
const Payment = require('../domain/Payments')

module.exports = (app)=>{
    app.put('/Payments/:id',async(req,res) =>{
        payment =  await Payment.PaymentSchema.findOne({_id:req.params.id})
        payment.Payed = true;
        await payment.save()
        res.send({
            status:"succes",
            updated: payment
        });
    })
}
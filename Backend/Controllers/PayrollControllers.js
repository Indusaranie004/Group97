const Payroll = require("../Model/PayrollModel");

//data display
const getAllPayrolls = async (req, res, next) => {
 
    let Payrolls;
     //Get all payrolls
    try{
        payrolls = await Payroll.find();
    }catch (err) {
        console.log(err);
    }

    //not found
    if(!payrolls){
        return res.status(404).json({message:"Payroll not found"});
    }

    //Display all payrolls
    return res.status(200).json({payrolls});
};

//data insert
const addPayrolls = async (req, res, next) => {
      
    const  {employee,bonus,salary,date,paymentStatus} = req.body;

    let payrolls;

    try{
        payrolls = new Payroll({employee,bonus,salary,date,paymentStatus});
        await payrolls.save();
    }catch (err) {
        console.log(err);
    }

    //not insert users
    if(!payrolls){
        return res.status(404).json({message:"able to add payrolls"});
    }
    return res.status(200).json({ payrolls });


};

//Get by Id
const getById = async (req, res,next) => {

    const id = req.params.id;

    let payroll;

    try{
        payroll = await Payroll.findById(id);
    }catch(err) {
        console.log(err);
    }
     //not available users
     if(!payroll){
        return res.status(404).json({message:"Payroll not found"});
    }
    return res.status(200).json({ payroll });
}

//Update Payroll Details
const updatePayroll = async (req, res, next) => {

    const id = req.params.id;
    const  {employee,bonus,salary,date,paymentStatus} = req.body;

    let payrolls;

    try{
        payrolls = await Payroll.findByIdAndUpdate(id, 
            { employee: employee, bonus: bonus, salary: salary, date: date, paymentStatus: paymentStatus});
            payrolls = await payrolls.save();
    }catch(err){
        console.log(err);
    }

    if(!payrolls){
        return res.status(404).json({message:"Unable to update payroll details"});
    }
    return res.status(200).json({ payrolls });
};

//delete Payroll details
const deletePayroll = async (req, res, next) => {
    const id = req.params.id;

    let payroll;

    try{
        payroll = await Payroll.findByIdAndDelete(id)
    }catch (err) {
        console.log(err);
    }
    if(!payroll){
        return res.status(404).json({message:"Unable to delete payroll details"});
    }
    return res.status(200).json({ payroll });
};


exports.getAllPayrolls = getAllPayrolls;
exports.addPayrolls = addPayrolls;
exports.getById = getById;
exports.updatePayroll = updatePayroll;
exports.deletePayroll = deletePayroll;



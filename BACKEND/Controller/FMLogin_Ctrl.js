const FMLoginSession = require("../Models/FMLogin_Model");

//Recording Login Session Data.
const Insert_LoginSession = async (req, res, next) => {
    const { UserName, Password } = req.body;

    let FM;

    try {
        FM = new FMLoginSession({ UserName, Password });
        await FM.save();
        return res.status(200).json({ FM });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Error inserting data", error: err });
    }
}

//Validating Login Credentials
const FinMng_Credentials = require("../Models/StaffMember_Model");

const Validate_FinancialManager = async (req, res) => {
    const { UserName, Password } = req.body;

    try {
        const FM = await FinMng_Credentials.findOne({ UserName });

        if (!FM) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare the plain password directly
        if (FM.Password !== Password) {
            return res.status(401).json({ error: "Incorrect Password" });
        }

        res.status(200).json({ message: "Login successful", FM });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    Insert_LoginSession,
    Validate_FinancialManager
};
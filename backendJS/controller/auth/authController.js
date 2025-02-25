import User from "../../model/User.model.js";
export const logInUser = async (req, res) => {
  try {
    const uid = req.params.uid;
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: true, message: "please provide email" });
    }

    const findUser = await User.findOne({ uid });
    if (findUser) {
      if (findUser.email !== email) {
        return res.status(400).json({
          success: true,
          message: "email not match, invalid input",
          matchUser: findUser,
        });
      }
      return res.status(200).json({
        success: true,
        message: "successfully find the user",
        data: findUser,
      });
    } else {
      return res.status(200).json({ success: true, message: "user not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: "Server Error brt brt",
        error: error.message,
      });
    }
  }
};

import { User } from "../models/userModels/user.models.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }

  } catch (error) {
    throw new Error(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
}

const registersUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (
    [name, email, password].some((field) => field?.trim() === "")
  ) {
    throw new Error(400, "All fields are required");
  }

  const existingUser = await User.findOne(
    {
      $or: [{ name }, { email }]
    }
  )
  if (existingUser) {
    throw new Error(409, "User with this username or email already exists");
  }
  // Create new user
  const newUser = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  })
  // Fetch the created user excluding sensitive fields like password
  const createdUser = await User.findById(newUser._id)
    .select("-password -refreshToken")
    .lean();

  if (!createdUser) {
    throw new Error(500, "Something went wrong while registering the user");
  }

  // Respond with success
  return res.json(200, createdUser, "User registered successfully")

}

const loggedInUser = async (res, req) => {
  // req.body => data -compleate
  const { email, password } = req.body
  if (!email) {
    throw new Error(400, "email is required");
  }

  const user = await User.findOne({
    $or: { email }
  })


  if (!user) {
    throw new Error(401, "User does not exits");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password)
  if (!isPasswordCorrect) {
    throw new Error(401, "Inavalid user password ");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  )

  const loginUser = await User.findById(userId).select("-password -refreshToken").lean()

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res.cookies(accessToken, options).cookies(refreshToken, options).json(200,
    { user: loginUser, accessToken, refreshToken },
    "User logged In Successfull")
  // username or email -compleate
  // find the user
  //password cheack
  // accesstoken and refreshtoken
}

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logout successfull"));
});

const generateNewRefreshToken = asyncHandler(async (req, res) => {
  const incommingRefeshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  console.log(incommingRefeshToken);

  if (!incommingRefeshToken) {
    throw new Error(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incommingRefeshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    console.log("decodedToken", decodedToken);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new Error(401, "Inavlid refresh token");
    }

    if (incommingRefeshToken !== user?.refreshToken) {
      throw new Error(401, "refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
      // secure: process.env.NODE_ENV === 'production', // here problem and check the error
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refesh"
        )
      );
  } catch (error) {
    throw new Error(401, error?.message || "Invalid refesh token");
  }
});

const changeCurrentUser = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  console.log(req.body);

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new Error(400, "old password incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.json(200, {}, "Password changed Successfully")
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.json(200, req.user, "Current user fetched successfully")
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname || !email) {
    throw new Error(400, "All fields are required");
  }

  const updateDetails = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
        // address: address._id
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.json(200, updateDetails, "Update Account details successfully")

});

export {
  registersUser,
  loggedInUser,
  logoutUser,
  generateNewRefreshToken,
  changeCurrentUser,
  getCurrentUser,
  updateAccountDetails,
};





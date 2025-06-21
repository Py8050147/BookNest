import { Book } from "../models/bookModels/book.models.js";
import { User } from "../models/userModels/user.models.js"
import { uploadImage } from "../lib/cloudinary.js"
import { isValidObjectId } from "mongoose";

export const createBook = async (req, res) => {
    try {
        const { title, description, genre } = await req.body

        if (!title || !description || !genre) {
            throw new Error(
                400,
                "title, description, and genre are required"
            );
        }



        const coverImage = req.files.coverImage[0]?.path
        const pdfFile = req.files.file[0]?.path

        const bookCoverImage = await uploadImage(coverImage)
        const bookPdfFile = await uploadImage(pdfFile)

        // const user = await User.findById(userId)

        // if (!user) {
        //     throw new Error(
        //         400,
        //         "user Unauthorized"
        //     );
        // }


        const book = await Book.create({
            title,
            description,
            author: req.user?._id,
            coverImage: bookCoverImage.url,
            file: bookPdfFile.url,
            genre
        })

        return res.json(200, "Book create successfull", book)


    } catch (error) {
        console.log(error)

    }
}
export const getAllBook = async (req, res) => {
    try {
        const { page = 1, limit = 30, query, sortBy, sortType, userId } = req.body
        let filter = {}
        if (query) {
            filter.$or = {
                name: { $regex: query, $options: "i" }
            }
        }

        if (userId === isValidObjectId(userId)) {
            filter.owner = userId
        }

        const sortOptions = {}
        if (sortBy && sortType) {
            sortOptions[sortBy] = sortBy === "desc" ? -1 : 1
        }

        const book = await Book.find(filter).sort(sortOptions).skip((page - 1) * limit).limit(parseInt(limit))
        const totalBook = await Book.countDocuments(book)

        return res.json(new Response(200, "All Book get successfully", totalBook))

    } catch (error) {
        res.json(new Error(500, error?.message || "Internal Server Error"))
    }
}
export const getBookId = async (req, res) => {
    try {
        const { bookId } = req.params
        if (!isValidObjectId(bookId)) {
            throw new Error('Please Provide a Valid Book Id');
        }

        const book = await Book.findById(bookId)
        if (!book) {
            throw new Error('Book not found');
        }

        return res.json(new Response(200, "Book get by Id successfull"))
    } catch (error) {
        res.json(new Response(500, error?.message || "Internal Server Error"))
    }
}
// export const updateBook = async () => { }
export const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params

        const book = await Book.findByIdAndDelete(bookId)

        return res.json(new Response(200, "Book delete successfull", book))
    } catch (error) {
        console.log(error)
        res.json(new Error(500, error?.message || "internal server error"))
    }
}
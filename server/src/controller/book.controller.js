import { Book } from "../models/bookModels/book.models.js";
import { User } from "../models/userModels/user.models.js"
import { uploadImage } from "../lib/cloudinary.js"

export const createBook = async (req, res) => {
    try {
        const { title, description, genre } = await req.body

        if (!title || !description || !genre) {
            throw new Error(
                400,
                "title, description, and genre are required"
            );
        }

        const user = await User.findById({
            _id: user.id
        })

        if (!user) {
            throw new Error(
                400,
                "user Unauthorized"
            );
        }

        const coverImage = req.file?.coverImage[0]?.path
        const pdfFile = req.file?.file[0]?.path

        await uploadImage(coverImage)
        await uploadImage(pdfFile)

        const book = await Book.create({
            title,
            description,
            author: user._id,
            coverImage: coverImage,
            file: pdfFile,
            genre
        })

        return res.json(200, "Book create successfull", book)


    } catch (error) {

    }
}
export const getAllBook = async () => {
    try {

    } catch (error) {

    }
}
export const getBookId = async () => { }
export const updateBook = async () => { }
export const deleteBook = async () => { }
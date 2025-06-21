import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { createBook, deleteBook, getAllBook, getBookId } from "../controller/book.controller.js";
import { upload } from "../middleware/multer.js";


const router = Router()

router.use(verifyToken)

router.route('/').get(getAllBook)
    .post(
        upload.fields([
            { name: "coverImage", maxCount: 1 },
            { name: "file", maxCount: 1 }
        ]),
        createBook
    )

router.route("/:bookId").get(getBookId)
    .delete(deleteBook)

export default router
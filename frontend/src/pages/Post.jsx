import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const Post = () => {
    const [files, setFiles] = useState([]);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('caption', e.target.caption.value)
        files.forEach((file, i) => {
            formData.append(`attachments[${i}]`, file)
        })

        try {
            const response = await axios.post('/posts', formData, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            })
            console.log(response.data);
            navigate('/')
            
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleFile = (e) => {
       const filesArray = Array.from(e.target.files)
       setFiles(prevFiles => [...prevFiles, ...filesArray]);
    }

    useEffect(() => {
        console.log(files);
    }, [files])
    return (
        <main class="mt-5">
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-md-5">
                        <div class="card">
                            <div class="card-header d-flex align-items-center justify-content-between bg-transparent py-3">
                                <h5 class="mb-0">Create new post</h5>
                            </div>
                            <div class="card-body">
                                <form method="post" onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div class="mb-2">
                                        <label for="caption">Caption</label>
                                        <textarea class="form-control" name="caption" id="caption" cols="30" rows="3"></textarea>
                                    </div>

                                    <div class="mb-3">
                                        <label for="attachments">Image(s)</label>
                                        <input type="file" class="form-control" id="attachments" name="attachments" multiple onChange={handleFile} />
                                    </div>

                                    <button type="submit" class="btn btn-primary w-100">
                                        Share
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}

export default Post;
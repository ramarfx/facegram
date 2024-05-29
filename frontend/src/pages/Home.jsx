import axios from "axios";
import { useEffect, useState } from "react";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/posts');
            const response2 = await axios.get('/users');
            setPosts(response.data.posts)
            setUsers(response2.data.users);
            console.log(response.data);
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchData()

    }, [])

    return (
        <main class="mt-5">
            <div class="container py-5">
                <div class="row justify-content-between">
                    <div class="col-md-8">
                        <h5 class="mb-3">News Feed</h5>
                        {posts && posts.map((post) => (
                            <div class="card mb-4">
                                <div class="card-header d-flex align-items-center justify-content-between bg-transparent py-3">
                                    <h6 class="mb-0">{post.user.username}</h6>
                                    <small class="text-muted">{post.created_at}</small>
                                </div>
                                <div class="card-body">
                                    <div class="card-images mb-2">
                                        {post.attachments?.map((attachment) => (
                                            <img src={'http://localhost:8000/storage/' + attachment.storage_path} alt="" class="w-100" />
                                        ))}
                                    </div>
                                    <p class="mb-0 text-muted"><b><a href="user-profile.html">{post.user.username}</a></b> {post.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div class="col-md-4">
                        <div class="request-follow mb-4">
                            <h6 class="mb-3">Follow Requests</h6>
                            <div class="request-follow-list">
                                <div class="card mb-2">
                                    <div class="card-body d-flex align-items-center justify-content-between p-2">
                                        <a href="user-profile-private.html">@laychristian92</a>
                                        <a href="" class="btn btn-primary btn-sm">
                                            Confirm
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="explore-people">
                            <h6 class="mb-3">Explore People</h6>
                            <div class="explore-people-list">
                                {users && users.slice(0 , 5).map((user) => (
                                    <div class="card mb-2">
                                        <div class="card-body p-2">
                                            <a href="user-profile-private.html">@{user.username}</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Home;
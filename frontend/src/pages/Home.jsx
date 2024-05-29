import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [isLoading, setIsloading] = useState(false);
    const [page, setPage] = useState(0)

    const fetchData = async () => {
        try {
            const response2 = await axios.get('/users');
            setUsers(response2.data.users);
        } catch (error) {

        }
    }

    const fetchPost = async (page = 0, size = 10) => {
        try {
            const response = await axios.get(`/posts?page=${page}&size=${size}`);
            if (page === 0) {
                setPosts(response.data.posts)
            } else {
                setPosts(prevPost => [...prevPost, ...response.data.posts])
                console.log(posts);
            }

        } catch (error) {

        }
    }

    const fetchFollowingRequest = async () => {
        try {
            const response3 = await axios.get('/users/' + sessionStorage.getItem('username') + '/followers')
            setFollowers(response3.data.followers);
        } catch (error) {
            console.log(error);
        }
    }

    const acceptFollow = async (username) => {
        try {
            const response = await axios.put(`/users/${username}/accept`);
            alert(response.data.message)

            fetchFollowingRequest()
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchData()
        fetchPost()
        fetchFollowingRequest()
    }, [])

    const handleScroll = () => {
        if ((window.scrollY + window.innerHeight) >= document.body.offsetHeight && !isLoading) {
            console.log('mentok');
            setIsloading(true);
            fetchPost(page, 7).then(() => {
                setIsloading(false);
                setPage(prevPage => prevPage + 1);
            }).catch(() => {
                setIsloading(false);
            });
        }
    };

    window.onscrollend = handleScroll

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
                                    <p class="mb-0 text-muted"><b><Link to={'/' + post.user.username}>{post.user.username}</Link></b> {post.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div class="col-md-4">
                        {followers && followers.filter(follower => follower.is_requested === true).length > 0 && (
                            <div class="request-follow mb-4">
                                <h6 class="mb-3">Follow Requests</h6>
                                <div class="request-follow-list">
                                    {followers.filter(user => user.is_requested).map((user) => (
                                        <div class="card mb-2">
                                            <div class="card-body d-flex align-items-center justify-content-between p-2">
                                                <Link to={'/' + user.username}>@{user.username}</Link>
                                                <button class="btn btn-primary btn-sm" onClick={() => acceptFollow(user.username)}>
                                                    Confirm
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div class="explore-people">
                            <h6 class="mb-3">Explore People</h6>
                            <div class="explore-people-list">
                                {users && users.map((user) => (
                                    <div class="card mb-2">
                                        <div class="card-body p-2">
                                            <Link to={'/' + user.username}>@{user.username}</Link>
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

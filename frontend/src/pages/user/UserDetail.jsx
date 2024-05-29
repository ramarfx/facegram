import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const UserDetail = () => {
    const { username } = useParams()
    const [user, setUser] = useState({})
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])

    const fetchUser = async () => {
        try {
            const response = await axios.get(`/users/${username}`)
            const response2 = await axios.get(`/users/${username}/followers`)
            const response3 = await axios.get(`/users/${username}/following`)
            setFollowers(response2.data.followers)
            setFollowing(response3.data.followings)
            setUser(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [username])

    useEffect(() => {
        console.log(user);
    }, [user])

    const handleFollow = async () => {
        try {
            const response = await axios.post(`/users/${username}/follow`)
            console.log(response);
            fetchUser()
        } catch (error) {

        }
    }

    const handleUnfollow = async () => {
        try {
            const response = await axios.delete(`/users/${username}/unfollow`)
            console.log(response);
            fetchUser()
        } catch (error) {

        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/posts/${id}`)
            console.log(response);
            fetchUser()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <main class="mt-5">
            <div class="container py-5">
                <div class="px-5 py-4 bg-light mb-4 d-flex align-items-center justify-content-between">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <h5 class="mb-0">{user.full_name}</h5>
                            <span>@{user.username}</span>
                        </div>
                        <small class="mb-0 text-muted">
                            {user.bio}
                        </small>
                    </div>
                    <div>
                        {user.is_your_account ? (
                            <Link to={'/post'} class="btn btn-primary w-100 mb-2">
                                + Create new post
                            </Link>
                        ) : (
                            user.following_status === 'not-following' ? (
                                <button onClick={handleFollow} class="btn btn-primary w-100 mb-2">
                                    Follow
                                </button>
                            ) : user.following_status === 'requested' ? (
                                <button onClick={handleUnfollow} class="btn btn-secondary w-100 mb-2">
                                    Requested
                                </button>
                            ) : (
                                <button onClick={handleUnfollow} class="btn btn-secondary w-100 mb-2">
                                    Following
                                </button>
                            )
                        )}

                        <div class="d-flex gap-3">
                            <div>
                                <div class="profile-label"><b>{user.post_count}</b> posts</div>
                            </div>
                            <div class="profile-dropdown">
                                <div class="profile-label"><b>{user.followers_count}</b> followers</div>
                                {!user.is_private || user.following_status === 'following' && (
                                    <div class="profile-list">
                                        <div class="card">
                                            <div class="card-body">
                                                {followers && followers.map((follower) => (
                                                    <div class="profile-user">
                                                        <Link to={'/' + follower.username}>@{follower.username}</Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div class="profile-dropdown">
                                <div class="profile-label"><b>{user.following_count}</b> following</div>
                                {!user.is_private || user.following_status === 'following' && (
                                    <div class="profile-list">
                                        <div class="card">
                                            <div class="card-body">
                                                {following && following.map((follower) => (
                                                    <div class="profile-user">
                                                        <Link to={'/' + follower.username}>@{follower.username}</Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {user.is_private && user.following_status !== 'following' ? (
                    <div class="card py-4">
                        <div class="card-body text-center">
                            &#128274; This account is private
                        </div>
                    </div>
                ) : (
                    <div class="row justify-content-center">
                        {user.posts?.map((post) => (
                            <div class="col-md-4">
                                <div class="card mb-4">
                                    <div class="card-body">
                                        <div class="card-images mb-2">
                                            {post.attachments?.map((attachment) => (
                                                <img src={"http://localhost:8000/storage/" + attachment.storage_path} className="w-100" />
                                            ))}
                                        </div>
                                        <p class="mb-0 text-muted">{post.caption}</p>
                                        {user.is_your_account && <button className="text-danger btn" onClick={() => handleDelete(post.id)}>delete</button>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </main >
    );
}

export default UserDetail;

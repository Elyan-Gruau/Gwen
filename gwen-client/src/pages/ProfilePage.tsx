import {useParams} from 'react-router-dom'

export default function ProfilePage() {
    const {userId} = useParams<{ userId: string }>()

    return (
        <div>
            <h1>Profile</h1>
            <p>Profile page — /profile/{userId}</p>
        </div>
    )
}


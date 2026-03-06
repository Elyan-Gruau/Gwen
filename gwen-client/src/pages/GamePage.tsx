import {useParams} from 'react-router-dom'

const GamePage = () => {
    const {gameId} = useParams<{ gameId: string }>()

    return (
        <div>
            <h1>Game</h1>
            <p>Game page — /play/{gameId}</p>
        </div>
    )
}

export default GamePage;


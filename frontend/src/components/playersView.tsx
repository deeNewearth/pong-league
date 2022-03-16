import { useEffect } from 'react';
import { useAppSelector } from "../store/configureStore";
import { Spinner } from 'react-bootstrap';
import { loadTopPlayers } from "../reducers/players";
import { useDispatch } from "react-redux";


export default function PlayersView() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadTopPlayers());
    }, []);

    const players = useAppSelector(state => state.players);

    if (players?.loading) {
        return <Spinner animation="border" />
    }

    if (players?.error) {
        return <h3 className="text-danger">{players.error}</h3>
    }

    return <div>
        <h3>Top Players</h3>
        <div className="d-flex gap-2 p-5 flex-row justify-content-around flex-wrap">
            {(players?.list || []).map((m, i) => <div key={i} className="playerTile p-3">
                <div>
                    <span className="text-muted">Name: </span>
                    <span>{m.name}</span>
                </div>
                <div>
                    <span className="text-muted">Phone Number: </span>
                    <span>{m.phoneNumber}</span>
                </div>
                <div>
                    <span className="text-muted">Points: </span>
                    <span>{m.rank}</span>
                </div>
            </div>)}

        </div>
    </div>;
}
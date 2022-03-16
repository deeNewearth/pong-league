import { useAppSelector } from "../store/configureStore";
import { Spinner } from 'react-bootstrap';

export default function MatchedView() {

    const matches = useAppSelector(state => state.matches);

    if (matches?.loading) {
        return <Spinner animation="border" />
    }

    if (matches?.error) {
        return <h3 className="text-danger">{matches.error}</h3>
    }

    return <div>
        <h3>Games</h3>

        <div className="d-flex gap-2 p-5 flex-row justify-content-around flex-wrap">

            {(matches?.list || []).map((m, i) => <div key={i} className="playerTile p-3" >
                <div>
                    <span className="text-muted">Tournament: </span>
                    <span>{m.details?.tournament}</span>
                </div>
                <div>
                    <span className="text-muted">Winner: </span>
                    <span>{m.winner.name}</span>
                </div>
                <div>
                    <span className="text-muted">Not Winner: </span>
                    <span>{m.looser.name}</span>
                </div>
                
                
            </div>)}

        </div>
    </div>;
}
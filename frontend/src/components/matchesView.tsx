import { useAppSelector } from "../store/configureStore";
import {Spinner} from 'react-bootstrap';

export default function MatchedView(){

    const matches = useAppSelector(state=>state.matches);

    if(matches?.loading){
        return <Spinner animation="border"/>
    }

    if(matches?.error){
        return <h3 className="text-danger">{matches.error}</h3>
    }

    return <div>
        {(matches?.list||[]).map((m,i)=><div key={i}>
            {m.details?.tournament}
        </div>)}
    </div>;
}
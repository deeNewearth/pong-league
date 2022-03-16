import { useState } from 'react';
import { Modal, Button, InputGroup, Form, FormControl, Spinner} from 'react-bootstrap';
import { IAsyncResult, ShowError, fetchJsonAsync } from './asyncLoad';
import { Match, Player, MatchDetails } from '../store/storeTypes';

type MatchPlayer = Player & {
    isNewPlayer?: boolean;
}


function PlayerEdit({ player, setPlayer }: {
    player?: MatchPlayer;
    setPlayer: (v: MatchPlayer) => any;
}) {
    return <div >
        <Form.Check
            type="checkbox" checked={player?.isNewPlayer}
            onClick={() => setPlayer({ ...player, isNewPlayer: !player?.isNewPlayer })}

            label="New Player"
        />

        {player?.isNewPlayer && <InputGroup className="mb-3">
            <InputGroup.Text >
                Player name
            </InputGroup.Text>
            <FormControl placeholder="player name is required" required 
                    value={player?.name||''} 
                    onChange={e=>setPlayer({...player,name:e.target.value})}
            />
        </InputGroup>}

        <InputGroup className="mb-3">
            <InputGroup.Text >
                Phone number
            </InputGroup.Text>
            <FormControl placeholder="We ID players by their phone number" required 
                    value={player?.phoneNumber||''} 
                    onChange={e=>setPlayer({...player,phoneNumber:e.target.value})}
            />
        </InputGroup>

    </div>;
}


export default function NewMatch() {
    const [submitted, setSubmitted] = useState<IAsyncResult<string>>();
    const [winner, setWinner] = useState<MatchPlayer>();
    const [looser, setLooser] = useState<MatchPlayer>();
    const [details, setDetails] = useState<MatchDetails>();

    return <Modal show={true} onHide={() => { }}>
        <Form onSubmit={async e=>{
            e.preventDefault();
            try{
                setSubmitted({isLoading:true});

                
                if(!winner?.phoneNumber || !looser?.phoneNumber || !details?.tournament){
                    throw new Error('phone numbers and tournament are required');
                }
                

                const variables ={
                    winnerPhoneNumber :winner.phoneNumber,
                    looserPhoneNumber :looser.phoneNumber,
                    tournament: details.tournament,
                    winnerName: (winner?.isNewPlayer && winner?.name) ||'',
                    looserName: (looser?.isNewPlayer && looser?.name) ||'',
                };

                const query = JSON.stringify({
                    query: `mutation CreateMatch($winnerPhoneNumber: String!, $looserPhoneNumber: String!, $tournament: String!, $winnerName: String, $looserName: String) {
                        createMatch(winnerPhoneNumber: $winnerPhoneNumber, looserPhoneNumber: $looserPhoneNumber, tournament: $tournament, winnerName: $winnerName, looserName: $looserName)
                      }`,
                      variables
                  });


              const done = await fetchJsonAsync<{
                  errors?:{
                    message:string
                  }[];
                  createMatch:string;

              }>(fetch('http://localhost:3000/dev/graphql',{
                headers: {'content-type': 'application/json'},
                method: 'POST',
                body: query,
              }));

              if(done.errors && done.errors.length > 0){
                  throw new Error(done.errors[0].message);
              }

              const result = done.createMatch;

              setSubmitted({result});


            }catch(error:any){
                setSubmitted({error});
            }
        }}>
        <Modal.Header closeButton>
            <Modal.Title>New Match</Modal.Title>
        </Modal.Header>
        <Modal.Body className="newMatch">

            <div>
                <InputGroup className="mb-5">
                    <InputGroup.Text >
                        Tournament
                    </InputGroup.Text>
                    <FormControl required  
                        value={details?.tournament||''} 
                        onChange={e=>setDetails({...details,tournament:e.target.value})}
                    />
                </InputGroup>
            </div>

            <div className="winner mb-5">
                <h4>Winner</h4>
                <PlayerEdit player={winner} setPlayer={p => setWinner(p)} />
            </div>

            <div className="looser">
                <h4>Looser</h4>
                <PlayerEdit player={looser} setPlayer={p => setLooser(p)} />
            </div>


        </Modal.Body>
        <Modal.Footer>


            {submitted?.isLoading && <Spinner animation="border"/>}

            {submitted?.error && <ShowError error={submitted.error}/> }

            <Button variant="secondary" onClick={() => { }}>
                Close
            </Button>
            <Button variant="primary"  type="submit"  >
                Register game
            </Button>
        </Modal.Footer>
        </Form>
    </Modal>
}
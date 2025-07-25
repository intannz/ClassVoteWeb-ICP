import { Actor, HttpAgent } from 'https://esm.sh/@dfinity/agent';

const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getResults' : IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))], ['query']),
    'resetVotes' : IDL.Func([], [IDL.Text], []),
    'vote' : IDL.Func([IDL.Text], [IDL.Text], []),
  });
};

export const canisterId = "4n3qe-piaaa-aaaab-qac7a-cai"; 

export const createActor = (identity) => {
  const agent = new HttpAgent({ identity });
  
  agent.fetchRootKey().catch(err => {
    console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
    console.error(err);
  });
  
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};
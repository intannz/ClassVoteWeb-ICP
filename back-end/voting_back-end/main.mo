import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

actor ClassVote {
  type Candidate = Text;
  type Voter = Principal;
  private var votes = HashMap.HashMap<Candidate, Nat>(10, Text.equal, Text.hash);
  private var hasVoted = HashMap.HashMap<Voter, Bool>(10, Principal.equal, Principal.hash);

  public shared (caller) func vote(candidateId: Candidate): async Text {
    let user = caller.caller;

    if (hasVoted.get(user) != null) {
      // UBAH: Pesan diubah ke Bahasa Inggris
      return "You have already voted.";
    };

    let currentVotes = switch (votes.get(candidateId)) {
      case (?count) count;
      case null 0;
    };
    votes.put(candidateId, currentVotes + 1);
    hasVoted.put(user, true);
    // UBAH: Pesan diubah ke Bahasa Inggris
    return "Vote submitted successfully.";
  };

  public query func getResults(): async [(Candidate, Nat)] {
    return Iter.toArray(votes.entries());
  };

  public func resetVotes(): async Text {
    votes := HashMap.HashMap<Candidate, Nat>(10, Text.equal, Text.hash);
    hasVoted := HashMap.HashMap<Voter, Bool>(10, Principal.equal, Principal.hash);
    // UBAH: Pesan diubah ke Bahasa Inggris
    return "Voting has been reset.";
  };
}
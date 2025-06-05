// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    uint constant defaultVotes = 0;
    address public commissioner;
    bool public votingActive;
    bool public registrationActive;
    Candidate public winner;

    mapping(address => Voter) public registeredVoters;
    mapping(address => Candidate) public candidates;
    address[] public candidateAddresses;
    uint public candidatesCount;
    uint public votersCount;

    struct Candidate {
        uint id;
        string name;
        address candidateAddress;
        uint voteCount;
        string otherDataUrl;
    }

    struct Voter {
        uint id;
        address voterAddress;
        string name;
        bool voted;
    }

    event Voted(
        address indexed voter,
        uint indexed candidateId,
        address indexed candidateAddress
    );

    event VotingStarted();

    event VotingStopped();

    event RegistrationStarted();

    event RegistrationStopped();

    event VoterRegistered(string name, address voterAddress);

    event WinnerDeclared(
        string name,
        uint id,
        address candidateAddress,
        uint voteCount
    );

    modifier onlyCommissioner() {
        require(
            msg.sender == commissioner,
            "Only the commissioner can perform this action."
        );
        _;
    }

    modifier registrationIsActive() {
        require(registrationActive, "Registration not active yet.");
        _;
    }

    modifier onlyWhenVotingActive() {
        require(votingActive, "Voting is not active.");
        _;
    }

    modifier onlyOnce() {
        require(!registeredVoters[msg.sender].voted, "You've already voted!");
        _;
    }

    modifier onlyWhenVotingStopped() {
        require(!votingActive, "Voting is still active. Stop voting first.");
        _;
    }

    modifier validCandidate(address _candidateAddress) {
        require(
            candidates[_candidateAddress].candidateAddress == _candidateAddress,
            "Invalid Candidate Address or ID!"
        );
        _;
    }

    modifier validVoter() {
        require(
            registeredVoters[msg.sender].voterAddress != address(0),
            "You are not a valid voter"
        );
        _;
    }

    constructor() {
        commissioner = msg.sender;
    }

    function addCandidate(
        string memory _name,
        address _candidateAddress,
        string memory _otherDataUrl
    ) public registrationIsActive {
        require(
            candidates[_candidateAddress].candidateAddress == address(0),
            "Candidate already registered."
        );
        candidatesCount++;
        candidates[_candidateAddress] = Candidate(
            candidatesCount,
            _name,
            _candidateAddress,
            defaultVotes,
            _otherDataUrl
        );

        candidateAddresses.push(_candidateAddress);
    }

    function registerVoter(string memory _name) public registrationIsActive {
        require(
            registeredVoters[msg.sender].voterAddress == address(0),
            "Voter already registered."
        );
        votersCount++;
        registeredVoters[msg.sender] = Voter({
            id: votersCount,
            voterAddress: msg.sender,
            name: _name,
            voted: false
        });

        emit VoterRegistered(_name, msg.sender);
    }

    function startRegistration() public onlyCommissioner {
        registrationActive = true;
        emit RegistrationStarted();
    }

    function stopRegistration() public onlyCommissioner {
        registrationActive = false;
        emit RegistrationStopped();
    }

    function startVoting() public onlyCommissioner {
        votingActive = true;
        emit VotingStarted();
    }

    function stopVoting() public onlyCommissioner {
        votingActive = false;
        emit VotingStopped();
    }

    function vote(
        address _candidateAddress,
        uint _id
    )
        public
        onlyWhenVotingActive
        onlyOnce
        validCandidate(_candidateAddress)
        validVoter
    {
        candidates[_candidateAddress].voteCount++;
        registeredVoters[msg.sender].voted = true;

        emit Voted(msg.sender, _id, _candidateAddress);
    }

    function getCandidate(
        address _candidateAddress
    ) public view returns (string memory, uint, uint) {
        Candidate memory candidate = candidates[_candidateAddress];
        return (candidate.name, candidate.id, candidate.voteCount);
    }

    function declareWinner()
        public
        onlyCommissioner
        onlyWhenVotingStopped
        returns (Candidate memory)
    {
        Candidate memory winningCandidate;
        uint winningVoteCount = 0;

        for (uint i = 0; i < candidateAddresses.length; i++) {
            Candidate memory currentCandidate = candidates[
                candidateAddresses[i]
            ];
            if (currentCandidate.voteCount > winningVoteCount) {
                winningVoteCount = currentCandidate.voteCount;
                winningCandidate = currentCandidate;
            }
        }

        winner = winningCandidate;

        emit WinnerDeclared(
            winner.name,
            winner.id,
            winner.candidateAddress,
            winner.voteCount
        );

        return winner;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AuctionRecord {
    struct Auction {
        uint256 auctionId;
        address winner;
        uint256 amount;
        uint256 timestamp;
        bool exists;
    }

    mapping(uint256 => Auction) public auctions;
    address public owner;

    event AuctionRecorded(uint256 indexed auctionId, address winner, uint256 amount, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() { owner = msg.sender; }

    function recordAuction(uint256 _id, address _winner, uint256 _amount) public onlyOwner {
        require(!auctions[_id].exists, "Already recorded");
        auctions[_id] = Auction(_id, _winner, _amount, block.timestamp, true);
        emit AuctionRecorded(_id, _winner, _amount, block.timestamp);
    }

    function getAuction(uint256 _id) public view returns (uint256, address, uint256, uint256) {
        require(auctions[_id].exists, "Not found");
        Auction memory a = auctions[_id];
        return (a.auctionId, a.winner, a.amount, a.timestamp);
    }
}

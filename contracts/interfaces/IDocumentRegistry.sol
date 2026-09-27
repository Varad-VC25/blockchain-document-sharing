// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IDocumentRegistry
 * @dev Interface for the DocumentRegistry smart contract.
 */
interface IDocumentRegistry {
    // -- Structs ---------------------------------------------------
    struct DocumentMetadata {
        string ipfsCid;
        string fileHash; // SHA-256 hash
        address owner;
        uint256 timestamp;
        string fileName;
        string mimeType;
        uint256 fileSize;
        uint256 version;
        bool exists;
    }

    // -- Events ----------------------------------------------------
    event DocumentRegistered(
        string indexed ipfsCid,
        address indexed owner,
        string fileHash,
        string fileName,
        uint256 timestamp
    );

    event AccessGranted(
        string indexed ipfsCid,
        address indexed owner,
        address indexed recipient,
        uint256 timestamp
    );

    event AccessRevoked(
        string indexed ipfsCid,
        address indexed owner,
        address indexed recipient,
        uint256 timestamp
    );

    event DocumentUpdated(
        string indexed ipfsCid,
        address indexed owner,
        string newFileHash,
        uint256 version,
        uint256 timestamp
    );

    // -- Functions -------------------------------------------------
    function registerDocument(
        string memory _ipfsCid,
        string memory _fileHash,
        string memory _fileName,
        string memory _mimeType,
        uint256 _fileSize
    ) external;

    function grantAccess(string memory _ipfsCid, address _recipient) external;

    function revokeAccess(string memory _ipfsCid, address _recipient) external;

    function checkAccess(string memory _ipfsCid, address _user) external view returns (bool);

    function isOwner(string memory _ipfsCid, address _user) external view returns (bool);

    function verifyIntegrity(string memory _ipfsCid, string memory _inputHash) external view returns (bool);

    function getDocument(string memory _ipfsCid) external view returns (DocumentMetadata memory);

    function getSharedUsers(string memory _ipfsCid) external view returns (address[] memory);

    function getOwnerDocuments(address _owner) external view returns (string[] memory);

    function getSharedDocuments(address _recipient) external view returns (string[] memory);
}

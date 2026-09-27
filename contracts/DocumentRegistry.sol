// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IDocumentRegistry.sol";

/**
 * @title DocumentRegistry
 * @notice Decentralized, cryptographically secure document permission and integrity registry.
 * @dev Stores document metadata (CID, SHA-256 hash, permissions) on Ethereum blockchain.
 */
contract DocumentRegistry is IDocumentRegistry {
    // -- State Variables -------------------------------------------
    address public contractOwner;
    uint256 public totalDocumentsRegistered;

    // CID => DocumentMetadata
    mapping(string => DocumentMetadata) private documents;

    // CID => (User Address => Has Access)
    mapping(string => mapping(address => bool)) private permissions;

    // CID => Array of addresses granted access
    mapping(string => address[]) private sharedUsersList;

    // Owner Address => Array of CIDs owned
    mapping(address => string[]) private ownerToCids;

    // Recipient Address => Array of CIDs shared with recipient
    mapping(address => string[]) private recipientToCids;

    // Track shared CIDs per recipient to prevent duplicates in array
    mapping(address => mapping(string => bool)) private isCidInSharedList;

    // -- Modifiers -------------------------------------------------
    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Only contract owner can perform this action");
        _;
    }

    modifier documentExists(string memory _ipfsCid) {
        require(documents[_ipfsCid].exists, "Document does not exist in registry");
        _;
    }

    modifier onlyDocumentOwner(string memory _ipfsCid) {
        require(documents[_ipfsCid].exists, "Document does not exist in registry");
        require(documents[_ipfsCid].owner == msg.sender, "Caller is not the owner of this document");
        _;
    }

    // -- Constructor -----------------------------------------------
    constructor() {
        contractOwner = msg.sender;
    }

    // -- Write Functions -------------------------------------------

    /**
     * @notice Registers a new document on the blockchain.
     * @param _ipfsCid IPFS Content Identifier
     * @param _fileHash SHA-256 hash of the unencrypted original document
     * @param _fileName Name of the file
     * @param _mimeType MIME type of the file
     * @param _fileSize Size of the file in bytes
     */
    function registerDocument(
        string memory _ipfsCid,
        string memory _fileHash,
        string memory _fileName,
        string memory _mimeType,
        uint256 _fileSize
    ) external override {
        require(bytes(_ipfsCid).length > 0, "IPFS CID cannot be empty");
        require(bytes(_fileHash).length > 0, "File hash cannot be empty");
        require(!documents[_ipfsCid].exists, "Document with this CID already registered");

        DocumentMetadata memory newDoc = DocumentMetadata({
            ipfsCid: _ipfsCid,
            fileHash: _fileHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            fileName: _fileName,
            mimeType: _mimeType,
            fileSize: _fileSize,
            version: 1,
            exists: true
        });

        documents[_ipfsCid] = newDoc;
        ownerToCids[msg.sender].push(_ipfsCid);

        // Owner automatically has full read/write permission
        permissions[_ipfsCid][msg.sender] = true;

        totalDocumentsRegistered++;

        emit DocumentRegistered(
            _ipfsCid,
            msg.sender,
            _fileHash,
            _fileName,
            block.timestamp
        );
    }

    /**
     * @notice Grants access to a document for a recipient wallet address.
     * @param _ipfsCid IPFS Content Identifier
     * @param _recipient Wallet address receiving access permission
     */
    function grantAccess(string memory _ipfsCid, address _recipient)
        external
        override
        onlyDocumentOwner(_ipfsCid)
    {
        require(_recipient != address(0), "Invalid recipient address");
        require(_recipient != msg.sender, "Owner already has access");
        require(!permissions[_ipfsCid][_recipient], "Recipient already has access");

        permissions[_ipfsCid][_recipient] = true;
        sharedUsersList[_ipfsCid].push(_recipient);

        if (!isCidInSharedList[_recipient][_ipfsCid]) {
            recipientToCids[_recipient].push(_ipfsCid);
            isCidInSharedList[_recipient][_ipfsCid] = true;
        }

        emit AccessGranted(_ipfsCid, msg.sender, _recipient, block.timestamp);
    }

    /**
     * @notice Revokes access to a document for a recipient wallet address.
     * @param _ipfsCid IPFS Content Identifier
     * @param _recipient Wallet address whose access permission is being revoked
     */
    function revokeAccess(string memory _ipfsCid, address _recipient)
        external
        override
        onlyDocumentOwner(_ipfsCid)
    {
        require(_recipient != address(0), "Invalid recipient address");
        require(_recipient != msg.sender, "Cannot revoke owner access");
        require(permissions[_ipfsCid][_recipient], "Recipient does not currently have access");

        permissions[_ipfsCid][_recipient] = false;

        emit AccessRevoked(_ipfsCid, msg.sender, _recipient, block.timestamp);
    }

    /**
     * @notice Updates document metadata for a new version.
     * @param _ipfsCid IPFS Content Identifier
     * @param _newFileHash SHA-256 hash of the updated document version
     */
    function updateDocumentVersion(string memory _ipfsCid, string memory _newFileHash)
        external
        onlyDocumentOwner(_ipfsCid)
    {
        require(bytes(_newFileHash).length > 0, "New file hash cannot be empty");

        DocumentMetadata storage doc = documents[_ipfsCid];
        doc.fileHash = _newFileHash;
        doc.version += 1;
        doc.timestamp = block.timestamp;

        emit DocumentUpdated(_ipfsCid, msg.sender, _newFileHash, doc.version, block.timestamp);
    }

    // -- Read Functions (Free Gas View Calls) ----------------------

    /**
     * @notice Checks if a wallet address has permission to access a document.
     * @param _ipfsCid IPFS Content Identifier
     * @param _user Wallet address to check
     * @return bool True if user is owner or has granted access
     */
    function checkAccess(string memory _ipfsCid, address _user)
        external
        view
        override
        documentExists(_ipfsCid)
        returns (bool)
    {
        if (documents[_ipfsCid].owner == _user) {
            return true;
        }
        return permissions[_ipfsCid][_user];
    }

    /**
     * @notice Verifies if a user is the owner of a document.
     */
    function isOwner(string memory _ipfsCid, address _user)
        external
        view
        override
        documentExists(_ipfsCid)
        returns (bool)
    {
        return documents[_ipfsCid].owner == _user;
    }

    /**
     * @notice Verifies cryptographic integrity by comparing input hash against stored hash.
     * @param _ipfsCid IPFS Content Identifier
     * @param _inputHash SHA-256 hash computed from downloaded document
     * @return bool True if input hash matches stored hash exactly
     */
    function verifyIntegrity(string memory _ipfsCid, string memory _inputHash)
        external
        view
        override
        documentExists(_ipfsCid)
        returns (bool)
    {
        return keccak256(bytes(documents[_ipfsCid].fileHash)) == keccak256(bytes(_inputHash));
    }

    /**
     * @notice Gets metadata for a document.
     */
    function getDocument(string memory _ipfsCid)
        external
        view
        override
        documentExists(_ipfsCid)
        returns (DocumentMetadata memory)
    {
        return documents[_ipfsCid];
    }

    /**
     * @notice Gets all wallet addresses granted access to a document.
     */
    function getSharedUsers(string memory _ipfsCid)
        external
        view
        override
        onlyDocumentOwner(_ipfsCid)
        returns (address[] memory)
    {
        return sharedUsersList[_ipfsCid];
    }

    /**
     * @notice Gets all CIDs owned by a wallet address.
     */
    function getOwnerDocuments(address _owner) external view override returns (string[] memory) {
        return ownerToCids[_owner];
    }

    /**
     * @notice Gets all CIDs shared with a recipient wallet address.
     */
    function getSharedDocuments(address _recipient) external view override returns (string[] memory) {
        return recipientToCids[_recipient];
    }
}

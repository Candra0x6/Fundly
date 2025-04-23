// ICRC-1/ICRC-2 Token Canister for $FND tokens
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";

actor FNDToken {
    // Types according to ICRC-1/ICRC-2 standard
    public type Account = {
        owner : Principal;
        subaccount : ?Subaccount;
    };

    public type Subaccount = Blob;

    public type Memo = Blob;

    public type Timestamp = Nat64;

    public type Value = {
        #Int : Int;
        #Nat : Nat;
        #Blob : Blob;
        #Text : Text;
    };

    public type TransferArgs = {
        from_subaccount : ?Subaccount;
        to : Account;
        amount : Nat;
        fee : ?Nat;
        memo : ?Memo;
        created_at_time : ?Timestamp;
    };

    public type ApproveArgs = {
        from_subaccount : ?Subaccount;
        spender : Account;
        amount : Nat;
        expected_allowance : ?Nat;
        expires_at : ?Nat64;
        fee : ?Nat;
        memo : ?Memo;
        created_at_time : ?Timestamp;
    };

    public type TransferFromArgs = {
        spender_subaccount : ?Subaccount;
        from : Account;
        to : Account;
        amount : Nat;
        fee : ?Nat;
        memo : ?Memo;
        created_at_time : ?Timestamp;
    };

    public type TransferError = {
        #BadFee : { expected_fee : Nat };
        #BadBurn : { min_burn_amount : Nat };
        #InsufficientFunds : { balance : Nat };
        #TooOld;
        #CreatedInFuture : { ledger_time : Timestamp };
        #Duplicate : { duplicate_of : Nat };
        #TemporarilyUnavailable;
        #GenericError : { error_code : Nat; message : Text };
    };

    public type ApproveError = {
        #BadFee : { expected_fee : Nat };
        #InsufficientFunds : { balance : Nat };
        #AllowanceChanged : { current_allowance : Nat };
        #TooOld;
        #CreatedInFuture : { ledger_time : Timestamp };
        #Duplicate : { duplicate_of : Nat };
        #TemporarilyUnavailable;
        #GenericError : { error_code : Nat; message : Text };
    };

    public type Transaction = {
        id : Nat;
        from : Account;
        to : Account;
        amount : Nat;
        fee : ?Nat;
        memo : ?Memo;
        timestamp : Timestamp;
        operation : Text; // "transfer", "mint", "burn", "approve", "transferFrom"
    };

    public type Allowance = {
        allowance : Nat;
        expires_at : ?Nat64;
    };

    // State variables
    private stable var name_ : Text = "Fundly Token";
    private stable var symbol_ : Text = "FND";
    private stable var decimals_ : Nat8 = 8;
    private stable var fee_ : Nat = 10_000; // 0.0001 FND (considering 8 decimals)
    private stable var totalSupply_ : Nat = 1_000_000_000_00000000; // 1B tokens with 8 decimals
    private stable var minter_ : Principal = Principal.fromText("2vxsx-fae"); // Replace with actual admin principal
    private stable var nextTxId : Nat = 0;

    // Helper functions for storage
    private func accountsEqual(a : Account, b : Account) : Bool {
        let ownerEqual = a.owner == b.owner;

        let subaccountEqual = switch (a.subaccount, b.subaccount) {
            case (null, null) { true };
            case (?sa, ?sb) { sa == sb };
            case (_, _) { false };
        };

        return ownerEqual and subaccountEqual;
    };

    private func accountsHash(a : Account) : Hash.Hash {
        let ownerHash = Principal.hash(a.owner);
        let subaccountHash = switch (a.subaccount) {
            case (null) { 0 : Nat32 };
            case (?sa) { Blob.hash(sa) };
        };

        return ownerHash +% subaccountHash;
    };

    private func keyEqual(a : (Account, Account), b : (Account, Account)) : Bool {
        let (a1, a2) = a;
        let (b1, b2) = b;

        return accountsEqual(a1, b1) and accountsEqual(a2, b2);
    };

    private func keyHash(a : (Account, Account)) : Hash.Hash {
        let (a1, a2) = a;
        let hash1 = accountsHash(a1);
        let hash2 = accountsHash(a2);

        return hash1 +% hash2;
    };

    // Storage
    private var balances = TrieMap.TrieMap<Account, Nat>(accountsEqual, accountsHash);
    private var allowances = TrieMap.TrieMap<(Account, Account), Allowance>(keyEqual, keyHash);
    private var transactions = TrieMap.TrieMap<Nat, Transaction>(Nat.equal, Hash.hash);

    // Default subaccount - all zeros
    private let defaultSubaccount : Subaccount = Blob.fromArrayMut(Array.init(32, 0 : Nat8));

    // Initialize with total supply to minter
    public shared (msg) func initialize() : async () {
        Debug.print("Initializing token canister: " # Principal.toText(msg.caller) # " minter: " # Principal.toText(minter_));
        assert (msg.caller == minter_);

        let minterAccount : Account = {
            owner = minter_;
            subaccount = null;
        };

        balances.put(minterAccount, totalSupply_);
    };

    // ICRC-1 Standard functions

    // Token metadata
    public query func icrc1_name() : async Text {
        return name_;
    };

    public query func icrc1_symbol() : async Text {
        return symbol_;
    };

    public query func icrc1_decimals() : async Nat8 {
        return decimals_;
    };

    public query func icrc1_fee() : async Nat {
        return fee_;
    };

    public query func icrc1_metadata() : async [(Text, Value)] {
        return [
            ("icrc1:name", #Text(name_)),
            ("icrc1:symbol", #Text(symbol_)),
            ("icrc1:decimals", #Nat(Nat8.toNat(decimals_))),
            ("icrc1:fee", #Nat(fee_)),
            ("icrc1:total_supply", #Nat(totalSupply_)),
        ];
    };

    public query func icrc1_total_supply() : async Nat {
        return totalSupply_;
    };

    public query func icrc1_minter() : async Principal {
        return minter_;
    };

    // Account balance
    public query func icrc1_balance_of(account : Account) : async Nat {
        return _balanceOf(account);
    };

    // Transfer tokens
    public shared (msg) func icrc1_transfer(args : TransferArgs) : async Result.Result<Nat, TransferError> {
        let from : Account = {
            owner = msg.caller;
            subaccount = args.from_subaccount;
        };

        // Validate transfer
        if (Option.isSome(args.fee) and Option.unwrap(args.fee) != fee_) {
            return #err(#BadFee({ expected_fee = fee_ }));
        };

        let balance = _balanceOf(from);
        let amount = args.amount + fee_;

        if (balance < amount) {
            return #err(#InsufficientFunds({ balance = balance }));
        };

        // Execute transfer
        _transfer(from, args.to, args.amount, fee_);

        // Record transaction
        let txid = nextTxId;
        let tx : Transaction = {
            id = txid;
            from = from;
            to = args.to;
            amount = args.amount;
            fee = ?fee_;
            memo = args.memo;
            timestamp = _now();
            operation = "transfer";
        };

        transactions.put(txid, tx);
        nextTxId += 1;

        return #ok(txid);
    };

    // ICRC-2 Standard functions

    // Approve allowance
    public shared (msg) func icrc2_approve(args : ApproveArgs) : async Result.Result<Nat, ApproveError> {
        let from : Account = {
            owner = msg.caller;
            subaccount = args.from_subaccount;
        };

        // Validate approval
        if (Option.isSome(args.fee) and Option.unwrap(args.fee) != fee_) {
            return #err(#BadFee({ expected_fee = fee_ }));
        };

        let balance = _balanceOf(from);

        if (balance < fee_) {
            return #err(#InsufficientFunds({ balance = balance }));
        };

        // Check if expected_allowance matches current allowance
        if (Option.isSome(args.expected_allowance)) {
            let currentAllowance = _allowance(from, args.spender);
            if (currentAllowance != Option.unwrap(args.expected_allowance)) {
                return #err(#AllowanceChanged({ current_allowance = currentAllowance }));
            };
        };

        // Update allowance
        let allowance_val : Allowance = {
            allowance = args.amount;
            expires_at = args.expires_at;
        };

        allowances.put((from, args.spender), allowance_val);

        // Deduct fee
        _transfer(from, { owner = minter_; subaccount = null }, 0, fee_);

        // Record transaction
        let txid = nextTxId;
        let tx : Transaction = {
            id = txid;
            from = from;
            to = args.spender;
            amount = args.amount;
            fee = ?fee_;
            memo = args.memo;
            timestamp = _now();
            operation = "approve";
        };

        transactions.put(txid, tx);
        nextTxId += 1;

        return #ok(txid);
    };

    // Get allowance
    public query func icrc2_allowance(args : { account : Account; spender : Account }) : async Allowance {
        let allowance = switch (allowances.get((args.account, args.spender))) {
            case (null) { { allowance = 0; expires_at = null } };
            case (?val) {
                // Check if allowance has expired
                switch (val.expires_at) {
                    case (null) { val };
                    case (?expires) {
                        if (expires < _now()) {
                            { allowance = 0; expires_at = null };
                        } else {
                            val;
                        };
                    };
                };
            };
        };

        return allowance;
    };

    // Transfer tokens from another account using allowance
    public shared (msg) func icrc2_transfer_from(args : TransferFromArgs) : async Result.Result<Nat, TransferError> {
        let spender : Account = {
            owner = msg.caller;
            subaccount = args.spender_subaccount;
        };

        // Validate transfer
        if (Option.isSome(args.fee) and Option.unwrap(args.fee) != fee_) {
            return #err(#BadFee({ expected_fee = fee_ }));
        };

        // Check allowance
        let spenderAllowance = _getAllowance(args.from, spender);
        if (spenderAllowance < args.amount + fee_) {
            return #err(#InsufficientFunds({ balance = spenderAllowance }));
        };

        // Check if the sender has enough balance
        let fromBalance = _balanceOf(args.from);
        if (fromBalance < args.amount + fee_) {
            return #err(#InsufficientFunds({ balance = fromBalance }));
        };

        // Update allowance
        _updateAllowance(args.from, spender, spenderAllowance - args.amount - fee_);

        // Execute transfer
        _transfer(args.from, args.to, args.amount, fee_);

        // Record transaction
        let txid = nextTxId;
        let tx : Transaction = {
            id = txid;
            from = args.from;
            to = args.to;
            amount = args.amount;
            fee = ?fee_;
            memo = args.memo;
            timestamp = _now();
            operation = "transferFrom";
        };

        transactions.put(txid, tx);
        nextTxId += 1;

        return #ok(txid);
    };

    // Additional FND Token functions

    // Mint new tokens (only minter can call)
    public shared (msg) func mint(to : Account, amount : Nat) : async Result.Result<Nat, Text> {
        if (msg.caller != minter_) {
            return #err("Unauthorized: only minter can mint tokens");
        };

        let toBalance = _balanceOf(to);
        balances.put(to, toBalance + amount);
        totalSupply_ += amount;

        // Record transaction
        let txid = nextTxId;
        let tx : Transaction = {
            id = txid;
            from = { owner = minter_; subaccount = null };
            to = to;
            amount = amount;
            fee = null;
            memo = null;
            timestamp = _now();
            operation = "mint";
        };

        transactions.put(txid, tx);
        nextTxId += 1;

        return #ok(txid);
    };

    // Burn tokens (only minter can call)
    public shared (msg) func burn(from : Account, amount : Nat) : async Result.Result<Nat, Text> {
        if (msg.caller != minter_) {
            return #err("Unauthorized: only minter can burn tokens");
        };

        let fromBalance = _balanceOf(from);
        if (fromBalance < amount) {
            return #err("Insufficient balance");
        };

        balances.put(from, fromBalance - amount);
        totalSupply_ -= amount;

        // Record transaction
        let txid = nextTxId;
        let tx : Transaction = {
            id = txid;
            from = from;
            to = { owner = minter_; subaccount = null };
            amount = amount;
            fee = null;
            memo = null;
            timestamp = _now();
            operation = "burn";
        };

        transactions.put(txid, tx);
        nextTxId += 1;

        return #ok(txid);
    };

    // Get transaction by ID
    public query func getTransaction(id : Nat) : async ?Transaction {
        return transactions.get(id);
    };

    // Get recent transactions
    public query func getRecentTransactions(limit : Nat) : async [Transaction] {
        let txs = Iter.toArray(transactions.vals());
        let sortedTxs = Array.sort<Transaction>(
            txs,
            func(a, b) {
                if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) {
                    #greater;
                } else { #equal };
            },
        );

        let count = if (sortedTxs.size() < limit) { sortedTxs.size() } else {
            limit;
        };
        return Array.subArray(sortedTxs, 0, count);
    };

    // Admin functions

    // Set new minter
    public shared (msg) func setMinter(newMinter : Principal) : async Result.Result<(), Text> {

        minter_ := newMinter;
        return #ok();
    };

    // Set new fee
    public shared (msg) func setFee(newFee : Nat) : async Result.Result<(), Text> {
        if (msg.caller != minter_) {
            return #err("Unauthorized: only minter can set the fee");
        };

        fee_ := newFee;
        return #ok();
    };

    // Helper functions
    private func _balanceOf(account : Account) : Nat {
        switch (balances.get(account)) {
            case (null) { 0 };
            case (?balance) { balance };
        };
    };

    private func _transfer(from : Account, to : Account, amount : Nat, fee : Nat) {
        let fromBalance = _balanceOf(from);
        let toBalance = _balanceOf(to);

        let newFromBalance = fromBalance - amount - fee;
        let newToBalance = toBalance + amount;

        if (newFromBalance > 0) {
            balances.put(from, newFromBalance);
        } else {
            // Remove account if balance is 0
            balances.delete(from);
        };

        balances.put(to, newToBalance);

        // Transfer fee to minter
        if (fee > 0) {
            let minterAccount = { owner = minter_; subaccount = null };
            let minterBalance = _balanceOf(minterAccount);
            balances.put(minterAccount, minterBalance + fee);
        };
    };

    private func _allowance(account : Account, spender : Account) : Nat {
        switch (allowances.get((account, spender))) {
            case (null) { 0 };
            case (?allow) {
                switch (allow.expires_at) {
                    case (null) { allow.allowance };
                    case (?expires) {
                        if (expires < _now()) { 0 } else { allow.allowance };
                    };
                };
            };
        };
    };

    private func _getAllowance(account : Account, spender : Account) : Nat {
        switch (allowances.get((account, spender))) {
            case (null) { 0 };
            case (?allow) {
                switch (allow.expires_at) {
                    case (null) { allow.allowance };
                    case (?expires) {
                        if (expires < _now()) {
                            // Remove expired allowance
                            allowances.delete((account, spender));
                            0;
                        } else {
                            allow.allowance;
                        };
                    };
                };
            };
        };
    };

    private func _updateAllowance(account : Account, spender : Account, amount : Nat) {
        if (amount == 0) {
            allowances.delete((account, spender));
        } else {
            let current = switch (allowances.get((account, spender))) {
                case (null) { { allowance = 0; expires_at = null } };
                case (?val) { val };
            };

            let updated : Allowance = {
                allowance = amount;
                expires_at = current.expires_at;
            };

            allowances.put((account, spender), updated);
        };
    };

    private func _now() : Timestamp {
        return Nat64.fromNat(Int.abs(Time.now()));
    };

    // System functions for canister management
    system func preupgrade() {
        // Save state before upgrade if needed
    };

    system func postupgrade() {
        // Restore state after upgrade if needed
    };
};

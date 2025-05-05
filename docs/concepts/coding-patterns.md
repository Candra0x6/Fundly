# Coding Patterns and Conventions

This document outlines the common coding patterns and conventions used throughout the ImpactInvest platform codebase.

## Error Handling Pattern

The codebase uses the `Result` type from the Motoko base library for functions that can fail:

```motoko
public func doSomething() : async Result.Result<SuccessType, ErrorType> {
  if (condition) {
    return #ok(successValue);
  } else {
    return #err(errorValue);
  };
}
```

### Error Types

Each canister typically defines its own error type as a variant:

```motoko
public type AuthError = {
  #NotAuthorized;
  #ProfileNotFound;
  #AlreadyExists;
  #SessionExpired;
  #InvalidToken;
  #OperationFailed;
};
```

## State Management Pattern

### HashMap Storage

Most canisters use `HashMap` for in-memory storage:

```motoko
private var items = HashMap.HashMap<Key, Value>(0, Key.equal, Key.hash);
```

### Stable Variable Persistence

For data that needs to persist across upgrades, we use stable variables and conversion in the upgrade hooks:

```motoko
private stable var stableItems : [(Key, Value)] = [];
private var items = HashMap.fromIter<Key, Value>(
  stableItems.vals(), 
  10, 
  Key.equal, 
  Key.hash
);

system func preupgrade() {
  stableItems := Iter.toArray(items.entries());
}

system func postupgrade() {
  stableItems := [];
}
```

## Caller Validation Pattern

All sensitive functions validate the caller's permissions:

```motoko
public shared (msg) func adminFunction() : async Result.Result<(), Error> {
  if (not (await AuthenticationCanister.isAdmin(msg.caller))) {
    return #err(#Unauthorized);
  };
  
  // Admin-only logic
  return #ok();
}
```

## Record Update Pattern

When updating records, we use the following pattern to maintain immutability:

```motoko
let updatedRecord = {
  id = record.id;
  field1 = newValue1;
  field2 = newValue2;
  // Copy all other fields from the original record
  field3 = record.field3;
  // ...
};
```

## Inter-Canister Communication Pattern

Inter-canister calls are made by importing the target canister and making async calls:

```motoko
import TargetCanister "canister:target_canister";

public shared func interCanisterFunction() : async Result.Result<(), Error> {
  try {
    let result = await TargetCanister.someMethod(arg1, arg2);
    switch (result) {
      case (#ok(value)) {
        // Handle success
        return #ok();
      };
      case (#err(error)) {
        // Handle error from target canister
        return #err(#OperationFailed);
      };
    };
  } catch (e) {
    // Handle exceptions during inter-canister call
    return #err(#OperationFailed);
  };
}
```

## Collection Management Patterns

### Adding Items to Collections

```motoko
private func _addItemToCollection(key : Key, item : Item) {
  switch (collection.get(key)) {
    case (null) {
      collection.put(key, [item]);
    };
    case (?existingItems) {
      collection.put(key, Array.append(existingItems, [item]));
    };
  };
}
```

### Removing Items from Collections

```motoko
private func _removeItemFromCollection(key : Key, itemId : ItemId) {
  switch (collection.get(key)) {
    case (null) { return };
    case (?existingItems) {
      let updatedItems = Array.filter<Item>(
        existingItems,
        func(item : Item) : Bool {
          return item.id != itemId;
        },
      );
      collection.put(key, updatedItems);
    };
  };
}
```

## Principal and Account Handling

### Account Type

The codebase uses a consistent Account type across all canisters:

```motoko
public type Account = {
  owner : Principal;
  subaccount : ?Subaccount;
};
```

### Subaccount Handling

```motoko
private func _accountsEqual(a : Account, b : Account) : Bool {
  let ownerEqual = a.owner == b.owner;
  
  let subaccountEqual = switch (a.subaccount, b.subaccount) {
    case (null, null) { true };
    case (?sa, ?sb) { sa == sb };
    case (_, _) { false };
  };
  
  return ownerEqual and subaccountEqual;
}
```

## Naming Conventions

- **Public Functions**: Camel case, descriptive names (`mintRevenueShareNFT`)
- **Private Functions**: Underscore prefix, camel case (`_addTokenToOwner`)
- **Variables**: Camel case (`userProfiles`)
- **Constants**: All caps with underscores (`SESSION_EXPIRY_NANOS`)
- **Types**: Pascal case (`UserProfile`)
- **Fields**: Camel case (`createdAt`)

## Code Organization

- **Types**: Defined at the top of the file
- **State Variables**: Defined after types
- **Public Functions**: Grouped by functionality
- **Private Helper Functions**: Defined at the bottom of the file
- **System Hooks**: `preupgrade` and `postupgrade` at the very end 
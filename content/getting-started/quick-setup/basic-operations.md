---
title: Basic Operations
---

# Basic Operations

Now that you have a working connection, let's explore the fundamental operations you can perform with Valkey GLIDE. We'll cover the most common commands: SET, GET, DEL, and more.

## String Operations

Strings are the most basic data type in Valkey/Redis. Let's start with simple key-value operations:

### SET and GET

<div class="code-tabs" data-labels='["Python","Java","Node.js","Go"]'>
<div class="tab-content" data-label="Python">

```python
import asyncio
from glide import GlideClient, NodeAddress

async def string_operations():
    client = GlideClient([NodeAddress("localhost", 6379)])
    
    try:
        # Set a key-value pair
        await client.set("user:1000", "john_doe")
        print("✓ Key set successfully")
        
        # Get the value
        value = await client.get("user:1000")
        print(f"✓ Retrieved value: {value}")
        
        # Set with expiration (10 seconds)
        await client.set("session:abc123", "active", ex=10)
        print("✓ Key set with expiration")
        
        # Check if key exists
        exists = await client.exists(["session:abc123"])
        print(f"✓ Key exists: {exists}")
        
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(string_operations())
```

</div>
<div class="tab-content" data-label="Java">

```java
import glide.api.GlideClient;
import glide.api.models.configuration.GlideClientConfiguration;
import glide.api.models.configuration.NodeAddress;
import glide.api.models.commands.SetOptions;

public class StringOperations {
    public static void main(String[] args) {
        GlideClientConfiguration config = GlideClientConfiguration.builder()
            .address(NodeAddress.builder().host("localhost").port(6379).build())
            .build();
        
        try (GlideClient client = GlideClient.createClient(config).get()) {
            // Set a key-value pair
            client.set("user:1000", "john_doe").get();
            System.out.println("✓ Key set successfully");
            
            // Get the value
            String value = client.get("user:1000").get();
            System.out.println("✓ Retrieved value: " + value);
            
            // Set with expiration (10 seconds)
            SetOptions options = SetOptions.builder().expireSeconds(10L).build();
            client.set("session:abc123", "active", options).get();
            System.out.println("✓ Key set with expiration");
            
            // Check if key exists
            Long exists = client.exists(new String[]{"session:abc123"}).get();
            System.out.println("✓ Key exists: " + (exists > 0));
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}
```

</div>
<div class="tab-content" data-label="Node.js">

```javascript
const { GlideClient } = require('@valkey/valkey-glide');

async function stringOperations() {
    const client = GlideClient.createClient({
        addresses: [{ host: 'localhost', port: 6379 }]
    });
    
    try {
        // Set a key-value pair
        await client.set('user:1000', 'john_doe');
        console.log('✓ Key set successfully');
        
        // Get the value
        const value = await client.get('user:1000');
        console.log(`✓ Retrieved value: ${value}`);
        
        // Set with expiration (10 seconds)
        await client.set('session:abc123', 'active', { ex: 10 });
        console.log('✓ Key set with expiration');
        
        // Check if key exists
        const exists = await client.exists(['session:abc123']);
        console.log(`✓ Key exists: ${exists > 0}`);
        
    } finally {
        client.close();
    }
}

stringOperations().catch(console.error);
```

</div>
<div class="tab-content" data-label="Go">

```go
package main

import (
    "fmt"
    "log"
    "time"
    
    "github.com/valkey-io/valkey-glide/go/glide/api"
)

func main() {
    config := &api.GlideClientConfiguration{
        Addresses: []api.NodeAddress{
            {Host: "localhost", Port: 6379},
        },
    }
    
    client := api.NewGlideClient(config)
    defer client.Close()
    
    // Set a key-value pair
    err := client.Set("user:1000", "john_doe")
    if err != nil {
        log.Fatalf("Set failed: %v", err)
    }
    fmt.Println("✓ Key set successfully")
    
    // Get the value
    value, err := client.Get("user:1000")
    if err != nil {
        log.Fatalf("Get failed: %v", err)
    }
    fmt.Printf("✓ Retrieved value: %s\n", value)
    
    // Set with expiration (10 seconds)
    err = client.SetWithExpiry("session:abc123", "active", 10*time.Second)
    if err != nil {
        log.Fatalf("SetWithExpiry failed: %v", err)
    }
    fmt.Println("✓ Key set with expiration")
    
    // Check if key exists
    exists, err := client.Exists([]string{"session:abc123"})
    if err != nil {
        log.Fatalf("Exists failed: %v", err)
    }
    fmt.Printf("✓ Key exists: %t\n", exists > 0)
}
```

</div>
</div>

### Multiple Operations

You can work with multiple keys efficiently:

<div class="code-tabs" data-labels='["Python","Java","Node.js","Go"]'>
<div class="tab-content" data-label="Python">

```python
# Set multiple keys at once
await client.mset({"user:1001": "alice", "user:1002": "bob", "user:1003": "charlie"})
print("✓ Multiple keys set")

# Get multiple keys at once
values = await client.mget(["user:1001", "user:1002", "user:1003"])
print(f"✓ Retrieved values: {values}")

# Delete multiple keys
deleted_count = await client.delete(["user:1001", "user:1002", "user:1003"])
print(f"✓ Deleted {deleted_count} keys")
```

</div>
<div class="tab-content" data-label="Java">

```java
// Set multiple keys at once
Map<String, String> keyValues = Map.of(
    "user:1001", "alice",
    "user:1002", "bob", 
    "user:1003", "charlie"
);
client.mset(keyValues).get();
System.out.println("✓ Multiple keys set");

// Get multiple keys at once
String[] keys = {"user:1001", "user:1002", "user:1003"};
String[] values = client.mget(keys).get();
System.out.println("✓ Retrieved values: " + Arrays.toString(values));

// Delete multiple keys
Long deletedCount = client.del(keys).get();
System.out.println("✓ Deleted " + deletedCount + " keys");
```

</div>
<div class="tab-content" data-label="Node.js">

```javascript
// Set multiple keys at once
await client.mset({
    'user:1001': 'alice',
    'user:1002': 'bob',
    'user:1003': 'charlie'
});
console.log('✓ Multiple keys set');

// Get multiple keys at once
const values = await client.mget(['user:1001', 'user:1002', 'user:1003']);
console.log(`✓ Retrieved values: ${values}`);

// Delete multiple keys
const deletedCount = await client.del(['user:1001', 'user:1002', 'user:1003']);
console.log(`✓ Deleted ${deletedCount} keys`);
```

</div>
<div class="tab-content" data-label="Go">

```go
// Set multiple keys at once
keyValues := map[string]string{
    "user:1001": "alice",
    "user:1002": "bob",
    "user:1003": "charlie",
}
err = client.MSet(keyValues)
if err != nil {
    log.Fatalf("MSet failed: %v", err)
}
fmt.Println("✓ Multiple keys set")

// Get multiple keys at once
keys := []string{"user:1001", "user:1002", "user:1003"}
values, err := client.MGet(keys)
if err != nil {
    log.Fatalf("MGet failed: %v", err)
}
fmt.Printf("✓ Retrieved values: %v\n", values)

// Delete multiple keys
deletedCount, err := client.Del(keys)
if err != nil {
    log.Fatalf("Del failed: %v", err)
}
fmt.Printf("✓ Deleted %d keys\n", deletedCount)
```

</div>
</div>

## Numeric Operations

Valkey/Redis can perform atomic operations on numeric values:

<div class="code-tabs" data-labels='["Python","Java","Node.js","Go"]'>
<div class="tab-content" data-label="Python">

```python
# Set a numeric value
await client.set("counter", "10")

# Increment by 1
new_value = await client.incr("counter")
print(f"✓ Counter incremented to: {new_value}")

# Increment by specific amount
new_value = await client.incrby("counter", 5)
print(f"✓ Counter incremented by 5 to: {new_value}")

# Decrement
new_value = await client.decr("counter")
print(f"✓ Counter decremented to: {new_value}")

# Work with floats
await client.set("price", "19.99")
new_price = await client.incrbyfloat("price", 2.50)
print(f"✓ Price increased to: {new_price}")
```

</div>
<div class="tab-content" data-label="Java">

```java
// Set a numeric value
client.set("counter", "10").get();

// Increment by 1
Long newValue = client.incr("counter").get();
System.out.println("✓ Counter incremented to: " + newValue);

// Increment by specific amount
newValue = client.incrBy("counter", 5L).get();
System.out.println("✓ Counter incremented by 5 to: " + newValue);

// Decrement
newValue = client.decr("counter").get();
System.out.println("✓ Counter decremented to: " + newValue);

// Work with floats
client.set("price", "19.99").get();
Double newPrice = client.incrByFloat("price", 2.50).get();
System.out.println("✓ Price increased to: " + newPrice);
```

</div>
<div class="tab-content" data-label="Node.js">

```javascript
// Set a numeric value
await client.set('counter', '10');

// Increment by 1
let newValue = await client.incr('counter');
console.log(`✓ Counter incremented to: ${newValue}`);

// Increment by specific amount
newValue = await client.incrBy('counter', 5);
console.log(`✓ Counter incremented by 5 to: ${newValue}`);

// Decrement
newValue = await client.decr('counter');
console.log(`✓ Counter decremented to: ${newValue}`);

// Work with floats
await client.set('price', '19.99');
const newPrice = await client.incrByFloat('price', 2.50);
console.log(`✓ Price increased to: ${newPrice}`);
```

</div>
<div class="tab-content" data-label="Go">

```go
// Set a numeric value
err = client.Set("counter", "10")
if err != nil {
    log.Fatalf("Set failed: %v", err)
}

// Increment by 1
newValue, err := client.Incr("counter")
if err != nil {
    log.Fatalf("Incr failed: %v", err)
}
fmt.Printf("✓ Counter incremented to: %d\n", newValue)

// Increment by specific amount
newValue, err = client.IncrBy("counter", 5)
if err != nil {
    log.Fatalf("IncrBy failed: %v", err)
}
fmt.Printf("✓ Counter incremented by 5 to: %d\n", newValue)

// Decrement
newValue, err = client.Decr("counter")
if err != nil {
    log.Fatalf("Decr failed: %v", err)
}
fmt.Printf("✓ Counter decremented to: %d\n", newValue)

// Work with floats
err = client.Set("price", "19.99")
if err != nil {
    log.Fatalf("Set failed: %v", err)
}

newPrice, err := client.IncrByFloat("price", 2.50)
if err != nil {
    log.Fatalf("IncrByFloat failed: %v", err)
}
fmt.Printf("✓ Price increased to: %.2f\n", newPrice)
```

</div>
</div>

## Key Management

Learn how to manage keys effectively:

<div class="code-tabs" data-labels='["Python","Java","Node.js","Go"]'>
<div class="tab-content" data-label="Python">

```python
# Set keys with different expiration times
await client.set("temp_key", "temporary", ex=30)  # 30 seconds
await client.set("session_key", "session_data", px=5000)  # 5000 milliseconds

# Check time to live
ttl = await client.ttl("temp_key")
print(f"✓ TTL for temp_key: {ttl} seconds")

# Set expiration on existing key
await client.expire("session_key", 60)  # 60 seconds from now
print("✓ Expiration set on existing key")

# Remove expiration
await client.persist("session_key")
print("✓ Expiration removed")

# Get all keys matching pattern
keys = await client.keys("user:*")
print(f"✓ Found keys: {keys}")

# Get random key
random_key = await client.randomkey()
print(f"✓ Random key: {random_key}")
```

</div>
<div class="tab-content" data-label="Java">

```java
// Set keys with different expiration times
SetOptions tempOptions = SetOptions.builder().expireSeconds(30L).build();
client.set("temp_key", "temporary", tempOptions).get();

SetOptions sessionOptions = SetOptions.builder().expireMilliseconds(5000L).build();
client.set("session_key", "session_data", sessionOptions).get();

// Check time to live
Long ttl = client.ttl("temp_key").get();
System.out.println("✓ TTL for temp_key: " + ttl + " seconds");

// Set expiration on existing key
client.expire("session_key", 60L).get();
System.out.println("✓ Expiration set on existing key");

// Remove expiration
client.persist("session_key").get();
System.out.println("✓ Expiration removed");

// Get all keys matching pattern
String[] keys = client.keys("user:*").get();
System.out.println("✓ Found keys: " + Arrays.toString(keys));

// Get random key
String randomKey = client.randomKey().get();
System.out.println("✓ Random key: " + randomKey);
```

</div>
<div class="tab-content" data-label="Node.js">

```javascript
// Set keys with different expiration times
await client.set('temp_key', 'temporary', { ex: 30 });  // 30 seconds
await client.set('session_key', 'session_data', { px: 5000 });  // 5000 milliseconds

// Check time to live
const ttl = await client.ttl('temp_key');
console.log(`✓ TTL for temp_key: ${ttl} seconds`);

// Set expiration on existing key
await client.expire('session_key', 60);  // 60 seconds from now
console.log('✓ Expiration set on existing key');

// Remove expiration
await client.persist('session_key');
console.log('✓ Expiration removed');

// Get all keys matching pattern
const keys = await client.keys('user:*');
console.log(`✓ Found keys: ${keys}`);

// Get random key
const randomKey = await client.randomKey();
console.log(`✓ Random key: ${randomKey}`);
```

</div>
<div class="tab-content" data-label="Go">

```go
// Set keys with different expiration times
err = client.SetWithExpiry("temp_key", "temporary", 30*time.Second)
if err != nil {
    log.Fatalf("SetWithExpiry failed: %v", err)
}

err = client.SetWithExpiryMs("session_key", "session_data", 5000*time.Millisecond)
if err != nil {
    log.Fatalf("SetWithExpiryMs failed: %v", err)
}

// Check time to live
ttl, err := client.TTL("temp_key")
if err != nil {
    log.Fatalf("TTL failed: %v", err)
}
fmt.Printf("✓ TTL for temp_key: %d seconds\n", ttl)

// Set expiration on existing key
err = client.Expire("session_key", 60*time.Second)
if err != nil {
    log.Fatalf("Expire failed: %v", err)
}
fmt.Println("✓ Expiration set on existing key")

// Remove expiration
err = client.Persist("session_key")
if err != nil {
    log.Fatalf("Persist failed: %v", err)
}
fmt.Println("✓ Expiration removed")

// Get all keys matching pattern
keys, err := client.Keys("user:*")
if err != nil {
    log.Fatalf("Keys failed: %v", err)
}
fmt.Printf("✓ Found keys: %v\n", keys)

// Get random key
randomKey, err := client.RandomKey()
if err != nil {
    log.Fatalf("RandomKey failed: %v", err)
}
fmt.Printf("✓ Random key: %s\n", randomKey)
```

</div>
</div>

## Complete Example

Here's a complete example that demonstrates all the operations we've covered:

<div class="code-tabs" data-labels='["Python","Java","Node.js","Go"]'>
<div class="tab-content" data-label="Python">

```python
import asyncio
from glide import GlideClient, NodeAddress

async def complete_example():
    client = GlideClient([NodeAddress("localhost", 6379)])
    
    try:
        print("=== Valkey GLIDE Basic Operations Demo ===\n")
        
        # 1. String operations
        print("1. String Operations:")
        await client.set("app:name", "My Awesome App")
        await client.set("app:version", "1.0.0")
        
        app_name = await client.get("app:name")
        app_version = await client.get("app:version")
        print(f"   App: {app_name} v{app_version}")
        
        # 2. Numeric operations
        print("\n2. Numeric Operations:")
        await client.set("visitors", "0")
        
        for i in range(5):
            visitors = await client.incr("visitors")
            print(f"   Visitor #{visitors} arrived")
        
        # 3. Multiple operations
        print("\n3. Multiple Operations:")
        users = {
            "user:alice": "Alice Johnson",
            "user:bob": "Bob Smith", 
            "user:charlie": "Charlie Brown"
        }
        await client.mset(users)
        
        user_names = await client.mget(list(users.keys()))
        for key, name in zip(users.keys(), user_names):
            print(f"   {key}: {name}")
        
        # 4. Key management
        print("\n4. Key Management:")
        await client.set("temp_data", "This will expire", ex=5)
        ttl = await client.ttl("temp_data")
        print(f"   Temporary data expires in {ttl} seconds")
        
        # 5. Cleanup
        print("\n5. Cleanup:")
        all_keys = await client.keys("*")
        if all_keys:
            deleted = await client.delete(all_keys)
            print(f"   Deleted {deleted} keys")
        
        print("\n✓ Demo completed successfully!")
        
    except Exception as e:
        print(f"✗ Error: {e}")
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(complete_example())
```

</div>
<div class="tab-content" data-label="Java">

```java
import glide.api.GlideClient;
import glide.api.models.configuration.GlideClientConfiguration;
import glide.api.models.configuration.NodeAddress;
import glide.api.models.commands.SetOptions;
import java.util.Map;
import java.util.Arrays;

public class CompleteExample {
    public static void main(String[] args) {
        GlideClientConfiguration config = GlideClientConfiguration.builder()
            .address(NodeAddress.builder().host("localhost").port(6379).build())
            .build();
        
        try (GlideClient client = GlideClient.createClient(config).get()) {
            System.out.println("=== Valkey GLIDE Basic Operations Demo ===\n");
            
            // 1. String operations
            System.out.println("1. String Operations:");
            client.set("app:name", "My Awesome App").get();
            client.set("app:version", "1.0.0").get();
            
            String appName = client.get("app:name").get();
            String appVersion = client.get("app:version").get();
            System.out.println("   App: " + appName + " v" + appVersion);
            
            // 2. Numeric operations
            System.out.println("\n2. Numeric Operations:");
            client.set("visitors", "0").get();
            
            for (int i = 0; i < 5; i++) {
                Long visitors = client.incr("visitors").get();
                System.out.println("   Visitor #" + visitors + " arrived");
            }
            
            // 3. Multiple operations
            System.out.println("\n3. Multiple Operations:");
            Map<String, String> users = Map.of(
                "user:alice", "Alice Johnson",
                "user:bob", "Bob Smith",
                "user:charlie", "Charlie Brown"
            );
            client.mset(users).get();
            
            String[] userKeys = users.keySet().toArray(new String[0]);
            String[] userNames = client.mget(userKeys).get();
            for (int i = 0; i < userKeys.length; i++) {
                System.out.println("   " + userKeys[i] + ": " + userNames[i]);
            }
            
            // 4. Key management
            System.out.println("\n4. Key Management:");
            SetOptions tempOptions = SetOptions.builder().expireSeconds(5L).build();
            client.set("temp_data", "This will expire", tempOptions).get();
            Long ttl = client.ttl("temp_data").get();
            System.out.println("   Temporary data expires in " + ttl + " seconds");
            
            // 5. Cleanup
            System.out.println("\n5. Cleanup:");
            String[] allKeys = client.keys("*").get();
            if (allKeys.length > 0) {
                Long deleted = client.del(allKeys).get();
                System.out.println("   Deleted " + deleted + " keys");
            }
            
            System.out.println("\n✓ Demo completed successfully!");
            
        } catch (Exception e) {
            System.err.println("✗ Error: " + e.getMessage());
        }
    }
}
```

</div>
<div class="tab-content" data-label="Node.js">

```javascript
const { GlideClient } = require('@valkey/valkey-glide');

async function completeExample() {
    const client = GlideClient.createClient({
        addresses: [{ host: 'localhost', port: 6379 }]
    });
    
    try {
        console.log('=== Valkey GLIDE Basic Operations Demo ===\n');
        
        // 1. String operations
        console.log('1. String Operations:');
        await client.set('app:name', 'My Awesome App');
        await client.set('app:version', '1.0.0');
        
        const appName = await client.get('app:name');
        const appVersion = await client.get('app:version');
        console.log(`   App: ${appName} v${appVersion}`);
        
        // 2. Numeric operations
        console.log('\n2. Numeric Operations:');
        await client.set('visitors', '0');
        
        for (let i = 0; i < 5; i++) {
            const visitors = await client.incr('visitors');
            console.log(`   Visitor #${visitors} arrived`);
        }
        
        // 3. Multiple operations
        console.log('\n3. Multiple Operations:');
        const users = {
            'user:alice': 'Alice Johnson',
            'user:bob': 'Bob Smith',
            'user:charlie': 'Charlie Brown'
        };
        await client.mset(users);
        
        const userKeys = Object.keys(users);
        const userNames = await client.mget(userKeys);
        userKeys.forEach((key, index) => {
            console.log(`   ${key}: ${userNames[index]}`);
        });
        
        // 4. Key management
        console.log('\n4. Key Management:');
        await client.set('temp_data', 'This will expire', { ex: 5 });
        const ttl = await client.ttl('temp_data');
        console.log(`   Temporary data expires in ${ttl} seconds`);
        
        // 5. Cleanup
        console.log('\n5. Cleanup:');
        const allKeys = await client.keys('*');
        if (allKeys.length > 0) {
            const deleted = await client.del(allKeys);
            console.log(`   Deleted ${deleted} keys`);
        }
        
        console.log('\n✓ Demo completed successfully!');
        
    } catch (error) {
        console.error(`✗ Error: ${error.message}`);
    } finally {
        client.close();
    }
}

completeExample().catch(console.error);
```

</div>
<div class="tab-content" data-label="Go">

```go
package main

import (
    "fmt"
    "log"
    "time"
    
    "github.com/valkey-io/valkey-glide/go/glide/api"
)

func main() {
    config := &api.GlideClientConfiguration{
        Addresses: []api.NodeAddress{
            {Host: "localhost", Port: 6379},
        },
    }
    
    client := api.NewGlideClient(config)
    defer client.Close()
    
    fmt.Println("=== Valkey GLIDE Basic Operations Demo ===\n")
    
    // 1. String operations
    fmt.Println("1. String Operations:")
    client.Set("app:name", "My Awesome App")
    client.Set("app:version", "1.0.0")
    
    appName, _ := client.Get("app:name")
    appVersion, _ := client.Get("app:version")
    fmt.Printf("   App: %s v%s\n", appName, appVersion)
    
    // 2. Numeric operations
    fmt.Println("\n2. Numeric Operations:")
    client.Set("visitors", "0")
    
    for i := 0; i < 5; i++ {
        visitors, _ := client.Incr("visitors")
        fmt.Printf("   Visitor #%d arrived\n", visitors)
    }
    
    // 3. Multiple operations
    fmt.Println("\n3. Multiple Operations:")
    users := map[string]string{
        "user:alice":   "Alice Johnson",
        "user:bob":     "Bob Smith",
        "user:charlie": "Charlie Brown",
    }
    client.MSet(users)
    
    userKeys := make([]string, 0, len(users))
    for key := range users {
        userKeys = append(userKeys, key)
    }
    
    userNames, _ := client.MGet(userKeys)
    for i, key := range userKeys {
        fmt.Printf("   %s: %s\n", key, userNames[i])
    }
    
    // 4. Key management
    fmt.Println("\n4. Key Management:")
    client.SetWithExpiry("temp_data", "This will expire", 5*time.Second)
    ttl, _ := client.TTL("temp_data")
    fmt.Printf("   Temporary data expires in %d seconds\n", ttl)
    
    // 5. Cleanup
    fmt.Println("\n5. Cleanup:")
    allKeys, _ := client.Keys("*")
    if len(allKeys) > 0 {
        deleted, _ := client.Del(allKeys)
        fmt.Printf("   Deleted %d keys\n", deleted)
    }
    
    fmt.Println("\n✓ Demo completed successfully!")
}
```

</div>
</div>

## What You've Learned

Congratulations! You've mastered the basic operations in Valkey GLIDE:

- **String Operations**: SET, GET, MSET, MGET
- **Numeric Operations**: INCR, DECR, INCRBY, INCRBYFLOAT
- **Key Management**: TTL, EXPIRE, PERSIST, EXISTS, DEL
- **Best Practices**: Error handling, connection management, cleanup

## Next Steps

Now that you understand the basics, you're ready to explore more advanced topics:

### **Build Real Applications**
- [Build a Caching App](../tutorials/caching-app.html) - Create a web application with caching
- [Real-time Notifications](../tutorials/pubsub-notifications.html) - Implement pub/sub messaging
- [Working with Clusters](../tutorials/clustering-guide.html) - Scale with cluster deployments

### **Solve Specific Problems**
- [Connection Management](../how-to/connection-management.html) - Advanced connection patterns
- [Performance Optimization](../how-to/performance-optimization.html) - Optimize for speed
- [Error Handling](../how-to/error-handling.html) - Handle failures gracefully

### **Understand the Architecture**
- [GLIDE Architecture](../concepts/architecture.html) - How GLIDE works internally
- [Batching vs Pipelining](../concepts/batching-pipelining.html) - Optimize command execution

---

**Previous**: [← First Connection](first-connection.html) | **Next**: [Build a Caching App →](../tutorials/caching-app.html)

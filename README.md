# Ball shop

## Event structure

------

### Headers

* MessageType = [EventName]

### Body

```javascript
{
    timestamp: DateTime,
    data: [EventData]
}
```

## Events

------

### ProductAddedToCatalogEvent

```javascript
{
    data: {
        id: String,
        title: String,
        description: String,
        inventory: Number,
        listings: [
            id: Sting,
            retailer: String,
            price: Number
        ]
    }
}
```

### RetailerRegisteredEvent

```javascript
{
    data: {
        id: String,
        name: String
    }
}
```

### ListingByRetailerEvent

```javascript
{
    data: {
        id: String,
        retailerId: String,
        productId: String,
        price: Number
    }
}
```

### ProductsAddedToInventoryEvent

```javascript
{
    data: {
        productId: String,
        addedToInventory: Number,
        newTotalInventory: Number
    }
}
```

### OrderRegisteredEvent

```javascript
{
    {
	date:DateTime,
	status:String,
	paymentType:String,
	customer:{name:String,adress:{street:String,housenumber:String,city:String,country:String}},
	products:[{name:String,retailer:{name:String}}]
    }
}
```
### OrderFinalizedEvent

```javascript
{
    {
	date:DateTime,
	status:String,
	paymentType:String,
	customer:{name:String,adress:{street:String,housenumber:String,city:String,country:String}},
	products:[{name:String,retailer:{name:String}}]
    }
}
```

### DeliveryIsSendEvent

```javascript
{
    data: {
        orderId: String,
        postalService: String,
        expectedDeliveryDate: Date
        products: [
            {
                productId: String,
                quantity: Number
            }
        ]
    }
}
```

### CustomerRegistered

```javascript
{
    {
	customerId:String,
	name:String,
	telephoneNumber:String,
	emailAddress:String
    }
}
```

### DayHasPassed

```javascript
{
    {}
}
```

### QuestionSubmitted

```javascript
{
    data: {
        id: int,
        userId: int,
        question: String
    }
}
```

### AnswerSubmitted
```javascript
{
    data: {
        id: int,
        questionId: int,
        userId: int,
        answer: String
    }
}
```